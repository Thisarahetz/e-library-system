import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('contact-information')
export class ContactInformation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  designation: string;

  @Column()
  mobileNumber: string;

  @Column()
  officeNumber: string;

  @Column()
  email: string;

  @Column()
  departmentName: string;

  @Column()
  departmentOfficeNumber: string;

  @Column()
  departmentEmail: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  province: string;

  @Column()
  district: string;

  constructor() {
    this.id = uuidv4();
  }
}
