import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_events')
export class AuditEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  actorId: string;

  @Column()
  action: string;

  @Column()
  resource: string;

  @Column()
  resourceId: string;

  @Column({ nullable: true })
  branchId: string;

  @CreateDateColumn()
  timestamp: Date;
}
