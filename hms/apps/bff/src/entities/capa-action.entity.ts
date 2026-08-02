import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('capa_actions')
export class CapaAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  incidentId: string;

  @Column()
  action: string;

  @Column()
  assignedTo: string;

  @Column({ default: 'open' })
  status: string;

  @Column({ type: 'date', nullable: true })
  dueDate: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
