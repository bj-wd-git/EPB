import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Ward } from './ward.entity';

@Entity('beds')
export class Bed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Ward)
  @JoinColumn({ name: 'wardId' })
  ward: Ward;

  @Column()
  wardId: string;

  @Column()
  code: string;

  @Column({ default: 'available' })
  status: string;
}
