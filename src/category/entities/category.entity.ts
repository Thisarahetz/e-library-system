import { UserFeatureCategory } from 'src/user/entities/user-feature-category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CategoryContent } from './categoryContent.entity';
import { Exclude } from 'class-transformer';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => CategoryContent, (categoryContent) => categoryContent.categorys)
  categoryContents: CategoryContent[];

  @Column({ nullable: true })
  parentId: string;

  @Column()
  type: string;

  @CreateDateColumn()
  date: Date;

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
