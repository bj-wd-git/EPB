import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErVisit } from '../entities/er-visit.entity';
import { Patient } from '../entities/patient.entity';
import { CreateErVisitDto, TriageErDto } from './dto/create-er-visit.dto';
import { AuditService } from '../common/audit.service';

@Injectable()
export class EmergencyService {
  constructor(
    @InjectRepository(ErVisit) private readonly erRepo: Repository<ErVisit>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    private readonly audit: AuditService,
  ) {}

  async register(dto: CreateErVisitDto, actorId: string) {
    let patientId: string | null = null;
    if (dto.patientUhid) {
      const patient = await this.patientRepo.findOne({ where: { uhid: dto.patientUhid } });
      if (!patient) throw new NotFoundException('Patient not found');
      patientId = patient.id;
    } else if (!dto.walkInName) {
      throw new BadRequestException('patientUhid or walkInName required');
    }
    const visit = await this.erRepo.save(
      this.erRepo.create({
        patientId,
        walkInName: dto.walkInName || null,
        chiefComplaint: dto.chiefComplaint || null,
        triageLevel: 'pending',
        status: 'active',
      }),
    );
    await this.audit.publish({ actorId, action: 'er.register', resource: 'er_visit', resourceId: visit.id });
    return { visitId: visit.id, status: visit.status, triageLevel: visit.triageLevel };
  }

  async triage(id: string, dto: TriageErDto, actorId: string) {
    const visit = await this.erRepo.findOne({ where: { id } });
    if (!visit) throw new NotFoundException('ER visit not found');
    visit.triageLevel = dto.triageLevel;
    await this.erRepo.save(visit);
    await this.audit.publish({ actorId, action: 'er.triage', resource: 'er_visit', resourceId: id });
    return { visitId: id, triageLevel: visit.triageLevel };
  }

  async listActive() {
    return this.erRepo.find({ where: { status: 'active' }, order: { arrivedAt: 'ASC' } });
  }
}
