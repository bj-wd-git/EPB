import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';

@Entity('teleconsult_sessions')
export class TeleconsultSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: string;

  @Column()
  doctorId: string;

  @Column({ type: 'datetime' })
  scheduledAt: Date;

  @Column({ default: 'scheduled' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
