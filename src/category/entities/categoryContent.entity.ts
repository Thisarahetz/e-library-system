import { UserFeatureCategory } from 'src/user/entities/user-feature-category.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Category } from './category.entity';

@Entity('catagory_content')
export class CategoryContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Category, (category) => category.categoryContents)
  categorys: Category;

  @Column()
  language: string;

  @Column()
  topicName: string;

  constructor() {
    this.id = uuidv4();
  }
}
