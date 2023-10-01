import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadFile } from './entities/upload.entity';
import { ArticleContent } from './entities/articleContent.entity';
import { Article } from './entities/article.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryModule } from 'src/category/category.module';
import { UploadFileModule } from 'src/upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UploadFile, ArticleContent, Article]),
    UserModule,
    AuthModule,
    CategoryModule,
    UploadFileModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule { }
