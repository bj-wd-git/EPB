import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileController } from './mobile.controller';
import { MobileService } from './mobile.service';
import { MobileDevice } from '../entities/mobile-device.entity';
import { Patient } from '../entities/patient.entity';
import { Appointment } from '../entities/appointment.entity';
import { Bed } from '../entities/bed.entity';
import { ErVisit } from '../entities/er-visit.entity';
import { LabOrder } from '../entities/lab-order.entity';
import { Invoice } from '../entities/invoice.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([MobileDevice, Patient, Appointment, Bed, ErVisit, LabOrder, Invoice, AuditEvent])],
  controllers: [MobileController],
  providers: [MobileService, AuditService],
})
export class MobileModule {}
