import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateItemDto, StockMovementDto } from './dto/inventory.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('inventory')
@UseGuards(RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('items')
  @RequirePermission('inventory:read')
  listItems() {
    return this.inventoryService.listItems();
  }

  @Post('items')
  @RequirePermission('inventory:write')
  createItem(@Body() dto: CreateItemDto, @Headers('x-actor-id') actorId = 'system') {
    return this.inventoryService.createItem(dto, actorId);
  }

  @Post('stock/receive')
  @RequirePermission('inventory:write')
  receive(@Body() dto: StockMovementDto, @Headers('x-actor-id') actorId = 'system') {
    return this.inventoryService.receiveStock(dto, actorId);
  }

  @Post('stock/consume')
  @RequirePermission('inventory:write')
  consume(@Body() dto: StockMovementDto, @Headers('x-actor-id') actorId = 'system') {
    return this.inventoryService.consumeStock(dto, actorId);
  }

  @Get('stock/low')
  @RequirePermission('inventory:read')
  lowStock() {
    return this.inventoryService.lowStock();
  }
}
