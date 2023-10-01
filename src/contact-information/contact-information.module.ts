import { Module } from '@nestjs/common';
import { ContactInformationService } from './contact-information.service';
import { ContactInformationController } from './contact-information.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactInformation } from './entities/contact-information.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactInformation])],
  controllers: [ContactInformationController],
  providers: [ContactInformationService],
})
export class ContactInformationModule {}
