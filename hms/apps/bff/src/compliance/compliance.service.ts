import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplianceIncident } from '../entities/compliance-incident.entity';
import { ConsentRecord } from '../entities/consent-record.entity';
import { CapaAction } from '../entities/capa-action.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { Patient } from '../entities/patient.entity';
import { CreateIncidentDto, CreateConsentDto, CreateCapaDto } from './dto/compliance.dto';
import { AuditService } from '../common/audit.service';

const COMPLIANCE_STANDARDS = [
  { code: 'NABH-PC', name: 'Patient Care', status: 'compliant' },
  { code: 'NABH-MR', name: 'Medical Records', status: 'compliant' },
  { code: 'JCI-IPS', name: 'International Patient Safety', status: 'compliant' },
  { code: 'JCI-QI', name: 'Quality Improvement', status: 'partial' },
];

@Injectable()
export class ComplianceService {
  constructor(
    @InjectRepository(ComplianceIncident) private readonly incidentRepo: Repository<ComplianceIncident>,
    @InjectRepository(ConsentRecord) private readonly consentRepo: Repository<ConsentRecord>,
    @InjectRepository(CapaAction) private readonly capaRepo: Repository<CapaAction>,
    @InjectRepository(AuditEvent) private readonly auditRepo: Repository<AuditEvent>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    private readonly audit: AuditService,
  ) {}

  async reportIncident(dto: CreateIncidentDto, reportedBy: string) {
    const incident = await this.incidentRepo.save(
      this.incidentRepo.create({ ...dto, severity: dto.severity || 'medium', reportedBy, status: 'open' }),
    );
    await this.audit.publish({ actorId: reportedBy, action: 'compliance.incident', resource: 'compliance_incident', resourceId: incident.id });
    return { incidentId: incident.id, title: incident.title, severity: incident.severity, status: incident.status };
  }

  listIncidents() {
    return this.incidentRepo.find({ order: { reportedAt: 'DESC' } });
  }

  async resolveIncident(id: string, actorId: string) {
    const incident = await this.incidentRepo.findOne({ where: { id } });
    if (!incident) throw new NotFoundException('Incident not found');
    incident.status = 'resolved';
    incident.resolvedAt = new Date();
    await this.incidentRepo.save(incident);
    await this.audit.publish({ actorId, action: 'compliance.resolve', resource: 'compliance_incident', resourceId: id });
    return { incidentId: id, status: incident.status };
  }

  async recordConsent(dto: CreateConsentDto, actorId: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid: dto.patientUhid } });
    if (!patient) throw new NotFoundException('Patient not found');
    const consent = await this.consentRepo.save(
      this.consentRepo.create({ patientId: patient.id, formType: dto.formType, status: 'signed', signedAt: new Date() }),
    );
    await this.audit.publish({ actorId, action: 'compliance.consent', resource: 'consent_record', resourceId: consent.id, branchId: patient.branchId });
    return { consentId: consent.id, formType: consent.formType, status: consent.status };
  }

  async listConsents(uhid: string) {
    const patient = await this.patientRepo.findOne({ where: { uhid } });
    if (!patient) throw new NotFoundException('Patient not found');
    return this.consentRepo.find({ where: { patientId: patient.id }, order: { createdAt: 'DESC' } });
  }

  async createCapa(dto: CreateCapaDto, actorId: string) {
    const incident = await this.incidentRepo.findOne({ where: { id: dto.incidentId } });
    if (!incident) throw new NotFoundException('Incident not found');
    const capa = await this.capaRepo.save(this.capaRepo.create({ ...dto, status: 'open' }));
    await this.audit.publish({ actorId, action: 'compliance.capa', resource: 'capa_action', resourceId: capa.id });
    return { capaId: capa.id, incidentId: capa.incidentId, status: capa.status };
  }

  async auditSummary() {
    const [openIncidents, resolvedIncidents, openCapa, auditCount] = await Promise.all([
      this.incidentRepo.count({ where: { status: 'open' } }),
      this.incidentRepo.count({ where: { status: 'resolved' } }),
      this.capaRepo.count({ where: { status: 'open' } }),
      this.auditRepo.count(),
    ]);
    return {
      standards: COMPLIANCE_STANDARDS,
      incidents: { open: openIncidents, resolved: resolvedIncidents },
      openCapaActions: openCapa,
      auditEventsTotal: auditCount,
    };
  }
}
