import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, OneToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Article } from './article.entity';
import { UploadFile } from 'src/article/entities/upload.entity';

@Entity('article_content')
export class ArticleContent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Article, (article) => article.articleContent)
  article: Article;

  @Column()
  title: string;

  @Column()
  language: string;

  @Column()
  description: string;
}
