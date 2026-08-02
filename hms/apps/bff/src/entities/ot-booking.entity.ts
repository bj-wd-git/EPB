import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';

@Entity('ot_bookings')
export class OtBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: string;

  @Column()
  surgeonId: string;

  @Column()
  procedure: string;

  @Column({ type: 'datetime' })
  scheduledAt: Date;

  @Column({ default: 'scheduled' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
