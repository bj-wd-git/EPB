import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { InventoryItem } from '../entities/inventory-item.entity';
import { StockMovement } from '../entities/stock-movement.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, StockMovement, AuditEvent])],
  controllers: [InventoryController],
  providers: [InventoryService, AuditService],
})
export class InventoryModule {}
