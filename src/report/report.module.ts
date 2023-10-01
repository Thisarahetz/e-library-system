import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { type } from 'os';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallRecord } from 'src/call-record/entities/call-record.entity';
import { User } from 'src/user/entities/user.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Category } from 'src/category/entities/category.entity';
import { CategoryContent } from 'src/category/entities/categoryContent.entity';
import { ArticleModule } from 'src/article/article.module';
import { ArticleContent } from 'src/article/entities/articleContent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CallRecord, User, Customer]), ArticleModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule { }
