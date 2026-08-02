import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => InventoryItem)
  @JoinColumn({ name: 'itemId' })
  item: InventoryItem;

  @Column()
  itemId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column()
  type: string;

  @Column({ nullable: true })
  reference: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
