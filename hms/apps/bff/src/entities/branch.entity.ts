import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 6 })
  code: string;

  @Column()
  name: string;
}
