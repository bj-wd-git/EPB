import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Patient } from '../entities/patient.entity';
import { Invoice } from '../entities/invoice.entity';
import { Admission } from '../entities/admission.entity';
import { Bed } from '../entities/bed.entity';
import { ErVisit } from '../entities/er-visit.entity';
import { LabOrder } from '../entities/lab-order.entity';
import { InventoryItem } from '../entities/inventory-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Invoice, Admission, Bed, ErVisit, LabOrder, InventoryItem])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
