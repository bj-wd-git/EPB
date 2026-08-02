import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';
import { Bed } from './bed.entity';

@Entity('admissions')
export class Admission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: string;

  @ManyToOne(() => Bed)
  @JoinColumn({ name: 'bedId' })
  bed: Bed;

  @Column()
  bedId: string;

  @Column({ default: 'admitted' })
  status: string;

  @CreateDateColumn()
  admittedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  dischargedAt: Date | null;
}
