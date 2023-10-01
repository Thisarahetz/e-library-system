import { Exclude } from 'class-transformer';
import { Customer } from 'src/customer/entities/customer.entity';
import { User } from 'src/user/entities/user.entity';
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('call-record')
export class CallRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  topic: string;

  @Column()
  callType: string;

  @Column()
  problem: string;

  @Column()
  priorityLevel: string;

  @Column()
  callBack: string;

  @Column()
  respond: string;

  @Column()
  requiredAction: string;

  @Column()
  actionTaken: string;

  @Column()
  status: string;

  @ManyToOne(() => Customer, (customer) => customer.callRecords)
  customer: Customer;

  @ManyToOne(() => User, (user) => user.callRecode)
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
