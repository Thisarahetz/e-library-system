import { Module } from '@nestjs/common';
import { PabxApiService } from './pabx-api.service';
import { PabxApiController } from './pabx-api.controller';
import { Pabx } from './entities/pabx-api.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeaderApiKeyStrategy } from './guards/auth-header-api-key.strategy';
import { PassportModule } from '@nestjs/passport';
import { EventsGateway } from 'src/events/events.gateway';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [PassportModule, CustomerModule, TypeOrmModule.forFeature([Pabx])],

  controllers: [PabxApiController],
  providers: [PabxApiService, HeaderApiKeyStrategy, EventsGateway],
})
export class PabxApiModule { }
