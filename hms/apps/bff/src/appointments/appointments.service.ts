import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Patient } from '../entities/patient.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AuditService } from '../common/audit.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment) private readonly apptRepo: Repository<Appointment>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    private readonly audit: AuditService,
  ) {}

  async book(dto: CreateAppointmentDto, actorId: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid: dto.patientUhid } });
    if (!patient) throw new NotFoundException('Patient not found');

    const conflict = await this.apptRepo.findOne({
      where: { doctorId: dto.doctorId, slotStart: new Date(dto.slotStart) },
    });
    if (conflict) {
      throw new ConflictException({ message: 'Slot conflict', appointmentId: conflict.id });
    }

    const queuePosition = dto.type === 'walk-in'
      ? (await this.apptRepo.count()) + 1
      : null;

    const appt = await this.apptRepo.save(
      this.apptRepo.create({
        patientId: patient.id,
        doctorId: dto.doctorId,
        slotStart: new Date(dto.slotStart),
        slotEnd: new Date(dto.slotEnd),
        status: 'confirmed',
        queuePosition,
      }),
    );

    await this.audit.publish({
      actorId,
      action: 'appointment.book',
      resource: 'appointment',
      resourceId: appt.id,
      branchId: patient.branchId,
    });

    return { appointmentId: appt.id, status: appt.status, queuePosition: appt.queuePosition };
  }
}
