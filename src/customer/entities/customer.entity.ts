import { Exclude } from 'class-transformer';
import { CallRecord } from 'src/call-record/entities/call-record.entity';
import { User } from 'src/user/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  mobileNumber: string;

  @Column()
  whatsappNumber: string;

  @Column({ unique: true })
  nicNumber: string;

  @Column()
  email: string;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  province: string;

  @OneToMany(() => CallRecord, (callRecord) => callRecord.customer)
  callRecords: CallRecord[];

  @ManyToOne(() => User, (user) => user.customer)
  user: User;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  constructor() {
    this.id = uuidv4();
  }
}
