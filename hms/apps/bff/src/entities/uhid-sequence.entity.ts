import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('uhid_sequences')
export class UhidSequence {
  @PrimaryColumn({ length: 6 })
  branchCode: string;

  @Column({ default: 0 })
  lastSequence: number;
}
