import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationsController } from './communications.controller';
import { CommunicationsService } from './communications.service';
import { Notification } from '../entities/notification.entity';
import { Appointment } from '../entities/appointment.entity';
import { Patient } from '../entities/patient.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Appointment, Patient, AuditEvent])],
  controllers: [CommunicationsController],
  providers: [CommunicationsService, AuditService],
})
export class CommunicationsModule {}
