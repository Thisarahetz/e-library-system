import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserFeatureCategory } from './user-feature-category.entity';
@Entity('action')
export class Action {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => UserFeatureCategory, (userFeatureCategorys) => userFeatureCategorys.actions)
  userFeatureCategorys: UserFeatureCategory;

  @Column({ nullable: true })
  categoryName: string;

  @Column({ nullable: true })
  categoryId: string;

  @Column({ nullable: true })
  categoryType: string;

  @Column({ type: 'int', array: true, nullable: true })
  action: number[];
}
