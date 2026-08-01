import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PharmacyController } from './pharmacy.controller';
import { PharmacyService } from './pharmacy.service';
import { Prescription } from '../entities/prescription.entity';
import { Patient } from '../entities/patient.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prescription, Patient, AuditEvent])],
  controllers: [PharmacyController],
  providers: [PharmacyService, AuditService],
  exports: [PharmacyService],
})
export class PharmacyModule {}
