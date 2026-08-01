import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from '../entities/prescription.entity';
import { Patient } from '../entities/patient.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { AuditService } from '../common/audit.service';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectRepository(Prescription) private readonly rxRepo: Repository<Prescription>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    private readonly audit: AuditService,
  ) {}

  async prescribe(dto: CreatePrescriptionDto, actorId: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid: dto.patientUhid } });
    if (!patient) throw new NotFoundException('Patient not found');
    const rx = await this.rxRepo.save(
      this.rxRepo.create({ patientId: patient.id, items: dto.items, status: 'prescribed' }),
    );
    await this.audit.publish({ actorId, action: 'pharmacy.prescribe', resource: 'prescription', resourceId: rx.id, branchId: patient.branchId });
    return { prescriptionId: rx.id, status: rx.status, items: rx.items };
  }

  async getPrescription(id: string) {
    const rx = await this.rxRepo.findOne({ where: { id } });
    if (!rx) throw new NotFoundException('Prescription not found');
    return rx;
  }

  async dispense(id: string, actorId: string) {
    const rx = await this.getPrescription(id);
    if (rx.status === 'dispensed') throw new BadRequestException('Already dispensed');
    rx.status = 'dispensed';
    await this.rxRepo.save(rx);
    await this.audit.publish({ actorId, action: 'pharmacy.dispense', resource: 'prescription', resourceId: id });
    return { prescriptionId: id, status: rx.status };
  }
}
