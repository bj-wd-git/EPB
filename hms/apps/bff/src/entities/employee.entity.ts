import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  employeeCode: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  department: string;

  @Column()
  designation: string;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  joinedAt: Date;
}
