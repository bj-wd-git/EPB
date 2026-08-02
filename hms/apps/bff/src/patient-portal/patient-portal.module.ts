import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientPortalController } from './patient-portal.controller';
import { PatientPortalService } from './patient-portal.service';
import { Patient } from '../entities/patient.entity';
import { Appointment } from '../entities/appointment.entity';
import { Invoice } from '../entities/invoice.entity';
import { Prescription } from '../entities/prescription.entity';
import { LabOrder } from '../entities/lab-order.entity';
import { TeleconsultSession } from '../entities/teleconsult-session.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { AppointmentsModule } from '../appointments/appointments.module';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, Appointment, Invoice, Prescription, LabOrder, TeleconsultSession, AuditEvent]),
    AppointmentsModule,
  ],
  controllers: [PatientPortalController],
  providers: [PatientPortalService, AuditService],
})
export class PatientPortalModule {}
