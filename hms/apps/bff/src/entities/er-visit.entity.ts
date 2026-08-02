import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';

@Entity('er_visits')
export class ErVisit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, { nullable: true })
  @JoinColumn({ name: 'patientId' })
  patient: Patient | null;

  @Column({ type: 'varchar', length: 36, nullable: true })
  patientId: string | null;

  @Column({ type: 'varchar', nullable: true })
  walkInName: string | null;

  @Column({ default: 'pending' })
  triageLevel: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'text', nullable: true })
  chiefComplaint: string | null;

  @CreateDateColumn()
  arrivedAt: Date;
}
