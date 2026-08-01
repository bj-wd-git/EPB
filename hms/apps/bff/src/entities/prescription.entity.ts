import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: string;

  @Column({ type: 'simple-json' })
  items: { drug: string; dose: string; frequency: string }[];

  @Column({ default: 'prescribed' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
