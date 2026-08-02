import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';
import { Employee } from '../entities/employee.entity';
import { LeaveRequest } from '../entities/leave-request.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, LeaveRequest, AuditEvent])],
  controllers: [HrController],
  providers: [HrService, AuditService],
})
export class HrModule {}
