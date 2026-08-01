import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { Patient } from '../entities/patient.entity';
import { Branch } from '../entities/branch.entity';
import { UhidSequence } from '../entities/uhid-sequence.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Branch, UhidSequence, AuditEvent])],
  controllers: [PatientsController],
  providers: [PatientsService, AuditService],
  exports: [PatientsService],
})
export class PatientsModule {}
