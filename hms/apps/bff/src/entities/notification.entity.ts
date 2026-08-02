import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  channel: string;

  @Column()
  recipient: string;

  @Column({ nullable: true })
  subject: string | null;

  @Column({ type: 'text' })
  body: string;

  @Column({ default: 'queued' })
  status: string;

  @Column({ nullable: true })
  referenceId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  sentAt: Date | null;
}
