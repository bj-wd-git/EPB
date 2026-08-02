import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorPortalController } from './doctor-portal.controller';
import { DoctorPortalService } from './doctor-portal.service';
import { Appointment } from '../entities/appointment.entity';
import { LabOrder } from '../entities/lab-order.entity';
import { TeleconsultSession } from '../entities/teleconsult-session.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { EmrModule } from '../emr/emr.module';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, LabOrder, TeleconsultSession, AuditEvent]), EmrModule],
  controllers: [DoctorPortalController],
  providers: [DoctorPortalService, AuditService],
})
export class DoctorPortalModule {}
