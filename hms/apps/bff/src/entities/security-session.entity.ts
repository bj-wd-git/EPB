import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('security_sessions')
export class SecuritySession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  actorId: string;

  @Column()
  role: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
