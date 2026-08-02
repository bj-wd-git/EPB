import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyController } from './emergency.controller';
import { EmergencyService } from './emergency.service';
import { ErVisit } from '../entities/er-visit.entity';
import { Patient } from '../entities/patient.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([ErVisit, Patient, AuditEvent])],
  controllers: [EmergencyController],
  providers: [EmergencyService, AuditService],
})
export class EmergencyModule {}
