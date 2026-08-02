import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from '../entities/inventory-item.entity';
import { StockMovement } from '../entities/stock-movement.entity';
import { CreateItemDto, StockMovementDto } from './dto/inventory.dto';
import { AuditService } from '../common/audit.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem) private readonly itemRepo: Repository<InventoryItem>,
    @InjectRepository(StockMovement) private readonly movementRepo: Repository<StockMovement>,
    private readonly audit: AuditService,
  ) {}

  listItems() {
    return this.itemRepo.find({ order: { sku: 'ASC' } });
  }

  async createItem(dto: CreateItemDto, actorId: string) {
    const existing = await this.itemRepo.findOne({ where: { sku: dto.sku } });
    if (existing) throw new BadRequestException('SKU already exists');
    const item = await this.itemRepo.save(
      this.itemRepo.create({
        sku: dto.sku,
        name: dto.name,
        category: dto.category,
        unit: dto.unit || 'unit',
        reorderLevel: dto.reorderLevel ?? 10,
        quantity: 0,
      }),
    );
    await this.audit.publish({ actorId, action: 'inventory.item.create', resource: 'inventory_item', resourceId: item.id });
    return { itemId: item.id, sku: item.sku, name: item.name };
  }

  async receiveStock(dto: StockMovementDto, actorId: string) {
    const item = await this.itemRepo.findOne({ where: { id: dto.itemId } });
    if (!item) throw new NotFoundException('Item not found');
    item.quantity += dto.quantity;
    await this.itemRepo.save(item);
    await this.movementRepo.save(
      this.movementRepo.create({ itemId: item.id, quantity: dto.quantity, type: 'receipt', reference: dto.reference || null }),
    );
    await this.audit.publish({ actorId, action: 'inventory.receive', resource: 'inventory_item', resourceId: item.id });
    return { itemId: item.id, sku: item.sku, quantity: item.quantity };
  }

  async consumeStock(dto: StockMovementDto, actorId: string) {
    const item = await this.itemRepo.findOne({ where: { id: dto.itemId } });
    if (!item) throw new NotFoundException('Item not found');
    if (item.quantity < dto.quantity) throw new BadRequestException('Insufficient stock');
    item.quantity -= dto.quantity;
    await this.itemRepo.save(item);
    await this.movementRepo.save(
      this.movementRepo.create({ itemId: item.id, quantity: dto.quantity, type: 'consumption', reference: dto.reference || null }),
    );
    await this.audit.publish({ actorId, action: 'inventory.consume', resource: 'inventory_item', resourceId: item.id });
    return { itemId: item.id, sku: item.sku, quantity: item.quantity };
  }

  async lowStock() {
    const items = await this.itemRepo.find();
    return items.filter((i) => i.quantity <= i.reorderLevel);
  }
}
