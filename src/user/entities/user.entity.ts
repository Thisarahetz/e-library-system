import { Customer } from 'src/customer/entities/customer.entity';
import { Role } from '../../../src/auth/enums';
import { UserFeatureCategory } from '../../../src/user/entities/user-feature-category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CallRecord } from 'src/call-record/entities/call-record.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => UserFeatureCategory, (userFeatureCategory) => userFeatureCategory.users, {
    cascade: true,
  })
  userFeatureCategorys: UserFeatureCategory;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  employeeId: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  status: boolean;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  profileImage: string;

  @OneToMany(() => Customer, (Customer) => Customer.user, {
    cascade: true,
  })
  customer: Customer[];

  @OneToMany(() => CallRecord, (callRecodes) => callRecodes.user, {
    cascade: true,
  })
  callRecode: CallRecord[];

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;
}
