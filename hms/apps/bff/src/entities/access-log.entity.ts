import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('access_logs')
export class AccessLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  actorId: string;

  @Column()
  method: string;

  @Column()
  path: string;

  @Column({ nullable: true })
  ip: string | null;

  @CreateDateColumn()
  timestamp: Date;
}
