import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WardController } from './ward.controller';
import { WardService } from './ward.service';
import { Ward } from '../entities/ward.entity';
import { Bed } from '../entities/bed.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ward, Bed, AuditEvent])],
  controllers: [WardController],
  providers: [WardService, AuditService],
  exports: [WardService],
})
export class WardModule {}
