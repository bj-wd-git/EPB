import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';

@Entity('consent_records')
export class ConsentRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: string;

  @Column()
  formType: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'datetime', nullable: true })
  signedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
