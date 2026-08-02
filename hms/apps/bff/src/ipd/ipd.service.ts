import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admission } from '../entities/admission.entity';
import { Patient } from '../entities/patient.entity';
import { Bed } from '../entities/bed.entity';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { AuditService } from '../common/audit.service';

@Injectable()
export class IpdService {
  constructor(
    @InjectRepository(Admission) private readonly admissionRepo: Repository<Admission>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Bed) private readonly bedRepo: Repository<Bed>,
    private readonly audit: AuditService,
  ) {}

  async admit(dto: CreateAdmissionDto, actorId: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid: dto.patientUhid } });
    if (!patient) throw new NotFoundException('Patient not found');
    const bed = await this.bedRepo.findOne({ where: { id: dto.bedId } });
    if (!bed) throw new NotFoundException('Bed not found');
    if (bed.status !== 'available') throw new ConflictException('Bed not available');
    bed.status = 'occupied';
    await this.bedRepo.save(bed);
    const admission = await this.admissionRepo.save(
      this.admissionRepo.create({ patientId: patient.id, bedId: bed.id, status: 'admitted' }),
    );
    await this.audit.publish({ actorId, action: 'ipd.admit', resource: 'admission', resourceId: admission.id, branchId: patient.branchId });
    return { admissionId: admission.id, bedCode: bed.code, status: admission.status };
  }

  async get(id: string) {
    const admission = await this.admissionRepo.findOne({ where: { id }, relations: ['patient', 'bed'] });
    if (!admission) throw new NotFoundException('Admission not found');
    return admission;
  }

  async discharge(id: string, actorId: string) {
    const admission = await this.get(id);
    if (admission.status === 'discharged') throw new BadRequestException('Already discharged');
    admission.status = 'discharged';
    admission.dischargedAt = new Date();
    await this.admissionRepo.save(admission);
    const bed = await this.bedRepo.findOne({ where: { id: admission.bedId } });
    if (bed) {
      bed.status = 'cleaning';
      await this.bedRepo.save(bed);
    }
    await this.audit.publish({ actorId, action: 'ipd.discharge', resource: 'admission', resourceId: id });
    return { admissionId: id, status: admission.status, dischargedAt: admission.dischargedAt };
  }

  async transfer(id: string, newBedId: string, actorId: string) {
    const admission = await this.get(id);
    if (admission.status !== 'admitted') throw new BadRequestException('Not admitted');
    const newBed = await this.bedRepo.findOne({ where: { id: newBedId } });
    if (!newBed || newBed.status !== 'available') throw new ConflictException('Target bed unavailable');
    const oldBed = await this.bedRepo.findOne({ where: { id: admission.bedId } });
    if (oldBed) {
      oldBed.status = 'cleaning';
      await this.bedRepo.save(oldBed);
    }
    newBed.status = 'occupied';
    await this.bedRepo.save(newBed);
    admission.bedId = newBedId;
    await this.admissionRepo.save(admission);
    await this.audit.publish({ actorId, action: 'ipd.transfer', resource: 'admission', resourceId: id });
    return { admissionId: id, bedId: newBedId, bedCode: newBed.code };
  }
}
