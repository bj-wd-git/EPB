import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('wards')
export class Ward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  branchId: string;
}
