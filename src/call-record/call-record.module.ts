import { Module } from '@nestjs/common';
import { CallRecordService } from './call-record.service';
import { CallRecordController } from './call-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallRecord } from './entities/call-record.entity';
import { CustomerModule } from 'src/customer/customer.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([CallRecord]), CustomerModule, UserModule],
  controllers: [CallRecordController],
  providers: [CallRecordService],
})
export class CallRecordModule {}
