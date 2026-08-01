import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { Branch } from '../entities/branch.entity';
import { UhidSequence } from '../entities/uhid-sequence.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { formatUhid, normalizeName } from '../common/uhid';
import { AuditService } from '../common/audit.service';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Branch) private readonly branchRepo: Repository<Branch>,
    @InjectRepository(UhidSequence) private readonly seqRepo: Repository<UhidSequence>,
    private readonly dataSource: DataSource,
    private readonly audit: AuditService,
  ) {}

  async register(dto: CreatePatientDto, actorId: string) {
    const branch = await this.branchRepo.findOne({ where: { id: dto.branchId } });
    if (!branch) throw new NotFoundException('Branch not found');

    if (!dto.overrideDuplicate) {
      const existing = await this.patientRepo.find({ where: { phone: dto.phone } });
      const dup = existing.find(
        (p) =>
          normalizeName(p.firstName, p.lastName) === normalizeName(dto.firstName, dto.lastName) &&
          p.dateOfBirth === dto.dateOfBirth,
      );
      if (dup) {
        throw new ConflictException({ message: 'Duplicate patient detected', existingUhid: dup.uhid });
      }
    }

    const uhid = await this.dataSource.transaction(async (manager) => {
      let seq = await manager.findOne(UhidSequence, { where: { branchCode: branch.code }, lock: { mode: 'pessimistic_write' } });
      if (!seq) {
        seq = manager.create(UhidSequence, { branchCode: branch.code, lastSequence: 0 });
      }
      seq.lastSequence += 1;
      await manager.save(seq);
      return formatUhid(branch.code, seq.lastSequence);
    });

    const patient = await this.patientRepo.save(
      this.patientRepo.create({ ...dto, uhid, branchId: branch.id }),
    );

    await this.audit.publish({
      actorId,
      action: 'patient.create',
      resource: 'patient',
      resourceId: patient.id,
      branchId: branch.id,
    });

    return { uhid: patient.uhid, patientId: patient.id, createdAt: patient.createdAt };
  }
}
