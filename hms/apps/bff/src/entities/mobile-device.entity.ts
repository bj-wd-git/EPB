import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('mobile_devices')
export class MobileDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  appType: string;

  @Column()
  platform: string;

  @Column()
  deviceToken: string;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  registeredAt: Date;
}
