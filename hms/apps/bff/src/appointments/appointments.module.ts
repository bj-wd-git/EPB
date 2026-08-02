import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from '../entities/appointment.entity';
import { Patient } from '../entities/patient.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Patient, AuditEvent])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AuditService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
