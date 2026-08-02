import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';
import { ComplianceIncident } from '../entities/compliance-incident.entity';
import { ConsentRecord } from '../entities/consent-record.entity';
import { CapaAction } from '../entities/capa-action.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { Patient } from '../entities/patient.entity';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([ComplianceIncident, ConsentRecord, CapaAction, AuditEvent, Patient])],
  controllers: [ComplianceController],
  providers: [ComplianceService, AuditService],
})
export class ComplianceModule {}
