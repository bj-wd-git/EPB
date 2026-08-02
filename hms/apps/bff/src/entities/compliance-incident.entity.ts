import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('compliance_incidents')
export class ComplianceIncident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'medium' })
  severity: string;

  @Column({ default: 'open' })
  status: string;

  @Column()
  reportedBy: string;

  @CreateDateColumn()
  reportedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  resolvedAt: Date | null;
}
