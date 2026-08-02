import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpdController } from './ipd.controller';
import { IpdService } from './ipd.service';
import { Admission } from '../entities/admission.entity';
import { Patient } from '../entities/patient.entity';
import { Bed } from '../entities/bed.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admission, Patient, Bed, AuditEvent])],
  controllers: [IpdController],
  providers: [IpdService, AuditService],
})
export class IpdModule {}
