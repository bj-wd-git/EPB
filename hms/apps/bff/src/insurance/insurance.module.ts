import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceController } from './insurance.controller';
import { InsuranceService } from './insurance.service';
import { InsurancePolicy } from '../entities/insurance-policy.entity';
import { InsuranceClaim } from '../entities/insurance-claim.entity';
import { Patient } from '../entities/patient.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([InsurancePolicy, InsuranceClaim, Patient, AuditEvent])],
  controllers: [InsuranceController],
  providers: [InsuranceService, AuditService],
})
export class InsuranceModule {}
