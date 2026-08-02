import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtBooking } from '../entities/ot-booking.entity';
import { Patient } from '../entities/patient.entity';
import { CreateOtBookingDto } from './dto/create-ot-booking.dto';
import { AuditService } from '../common/audit.service';

@Injectable()
export class OtService {
  constructor(
    @InjectRepository(OtBooking) private readonly otRepo: Repository<OtBooking>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    private readonly audit: AuditService,
  ) {}

  async book(dto: CreateOtBookingDto, actorId: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid: dto.patientUhid } });
    if (!patient) throw new NotFoundException('Patient not found');
    const booking = await this.otRepo.save(
      this.otRepo.create({
        patientId: patient.id,
        surgeonId: dto.surgeonId,
        procedure: dto.procedure,
        scheduledAt: new Date(dto.scheduledAt),
        status: 'scheduled',
      }),
    );
    await this.audit.publish({ actorId, action: 'ot.book', resource: 'ot_booking', resourceId: booking.id, branchId: patient.branchId });
    return { bookingId: booking.id, procedure: booking.procedure, status: booking.status, scheduledAt: booking.scheduledAt };
  }

  async get(id: string) {
    const booking = await this.otRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('OT booking not found');
    return booking;
  }

  async complete(id: string, actorId: string) {
    const booking = await this.get(id);
    if (booking.status === 'completed') throw new BadRequestException('Already completed');
    booking.status = 'completed';
    await this.otRepo.save(booking);
    await this.audit.publish({ actorId, action: 'ot.complete', resource: 'ot_booking', resourceId: id });
    return { bookingId: id, status: booking.status };
  }
}
