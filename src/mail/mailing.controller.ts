import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('mailing')
@UseGuards(JwtAuthGuard)
export class MailingController {
  constructor(private readonly mailerService: MailingService) {}

  //send Email once employee create (email&pwd)
  @Post('email')
  async sendEmail(@Body('subject') subject: string, @Body('option') option: any): Promise<void> {
    await this.mailerService.sendMail(subject, option);
  }
}
