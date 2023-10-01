import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('audit')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column()
  message: string;

  @Column()
  statusCode: string;

  @Column()
  userId: string;

  @Column()
  metadata: string;

  constructor() {
    this.id = uuidv4();
  }
}
