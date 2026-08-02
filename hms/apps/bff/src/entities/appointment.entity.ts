import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Patient } from './patient.entity';

@Entity('appointments')
@Index(['doctorId', 'slotStart'], { unique: true })
export class Appointment {
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
  slotStart: Date;

  @Column({ type: 'datetime' })
  slotEnd: Date;

  @Column({ default: 'confirmed' })
  status: string;

  @Column({ nullable: true })
  queuePosition: number | null;
}
