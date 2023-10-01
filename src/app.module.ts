import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/data-source';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customer/customer.module';
import { CallRecordModule } from './call-record/call-record.module';
import { ContactInformationModule } from './contact-information/contact-information.module';
import { CategoryModule } from './category/category.module';
import { ArticleModule } from './article/article.module';
import { UploadFileModule } from './upload/upload.module';
import { AuditModule } from './audit/audit.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailingModule } from './mail/mailing.module';
import { CaslModule } from './casl/casl.module';
import { ReportModule } from './report/report.module';
import { PabxApiModule } from './pabx-api/pabx-api.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
    AuthModule,
    UserModule,
    MailingModule,
    CaslModule,
    CustomerModule,
    CallRecordModule,
    ContactInformationModule,
    CategoryModule,
    ArticleModule,
    UploadFileModule,
    AuditModule,
    ReportModule,
    PabxApiModule,
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
