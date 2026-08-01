import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';

@Entity('lab_orders')
export class LabOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: string;

  @Column({ type: 'simple-json' })
  testCodes: string[];

  @Column({ default: 'ordered' })
  status: string;

  @Column({ type: 'simple-json', nullable: true })
  results: Record<string, string> | null;

  @CreateDateColumn()
  createdAt: Date;
}
