import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RadiologyController } from './radiology.controller';
import { RadiologyService } from './radiology.service';
import { RadiologyOrder } from '../entities/radiology-order.entity';
import { Patient } from '../entities/patient.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([RadiologyOrder, Patient, AuditEvent])],
  controllers: [RadiologyController],
  providers: [RadiologyService, AuditService],
})
export class RadiologyModule {}
