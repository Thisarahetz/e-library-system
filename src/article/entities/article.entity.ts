import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { ArticleContent } from './articleContent.entity';
import { UploadFile } from './upload.entity';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ArticleContent, (articleContent) => articleContent.article, {
    onDelete: 'CASCADE',
  })
  articleContent: ArticleContent[];

  @OneToMany(() => UploadFile, (uploadFile) => uploadFile.article, {
    onDelete: 'CASCADE',
  })
  uploadFile: UploadFile[];

  @Column()
  topicId: string;

  @CreateDateColumn()
  date: Date;
}
