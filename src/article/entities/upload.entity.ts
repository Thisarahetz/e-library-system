import { ArticleContent } from 'src/article/entities/articleContent.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class UploadFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  key: string;

  @Column()
  size: string;

  @Column()
  fileType: string;

  @ManyToOne(() => Article, (article) => article.uploadFile)
  article: ArticleContent;
}
