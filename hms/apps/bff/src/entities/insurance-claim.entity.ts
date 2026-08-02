import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';
import { InsurancePolicy } from './insurance-policy.entity';

@Entity('insurance_claims')
export class InsuranceClaim {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: string;

  @ManyToOne(() => InsurancePolicy)
  @JoinColumn({ name: 'policyId' })
  policy: InsurancePolicy;

  @Column()
  policyId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  invoiceId: string | null;

  @Column({ default: 'submitted' })
  status: string;

  @CreateDateColumn()
  submittedAt: Date;
}
