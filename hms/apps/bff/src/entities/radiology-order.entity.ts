import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';

@Entity('radiology_orders')
export class RadiologyOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: string;

  @Column()
  modality: string;

  @Column({ default: 'ordered' })
  status: string;

  @Column({ type: 'text', nullable: true })
  report: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
