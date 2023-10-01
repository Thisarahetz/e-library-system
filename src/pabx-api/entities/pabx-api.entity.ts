import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('pabx-api')
export class Pabx {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  callType: string;

  @Column()
  callDate: string;

  @Column()
  callTime: string;

  @Column()
  callDuration: string;

  @Column()
  dialedNo: string;

  @Column()
  station: string;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;
}
