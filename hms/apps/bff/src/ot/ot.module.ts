import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtController } from './ot.controller';
import { OtService } from './ot.service';
import { OtBooking } from '../entities/ot-booking.entity';
import { Patient } from '../entities/patient.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([OtBooking, Patient, AuditEvent])],
  controllers: [OtController],
  providers: [OtService, AuditService],
})
export class OtModule {}
