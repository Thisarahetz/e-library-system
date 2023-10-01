/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';
import { SESClient, SendEmailRequest, SendEmailCommand, GetSendQuotaCommand } from '@aws-sdk/client-ses';

//type
type Options = {
  email: string;
  password?: string;
  token: string;
  topic?: string;
};
const templatePath = '../../mail/templates/email.html';
@Injectable()
export class MailingService {
  private transporter: nodemailer.Transporter;
  private sesClient: SESClient;

  constructor() {
    const environment = process.env.NODE_ENV;
    if (
      environment === 'development' ||
      environment === 'stage' ||
      environment === 'local' ||
      environment === 'stage-v2' ||
      environment === 'stage-v3'
    ) {
      //nodemailer
      // Create a transporter object using SMTP
      this.transporter = nodemailer.createTransport({
        service: process.env.MAIL_MAILER,
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      });
      this.checkNodeMailerReady();
    }
    if (environment === 'production') {
      //ses
      this.sesClient = new SESClient({ region: process.env.AWS_REGION });
      this.checkSESReady();
    }
  }

  getEmailBody(options: Options) {
    const html = fs.readFileSync(path.resolve(__dirname, templatePath), {
      encoding: 'utf-8',
    });
    const template = Handlebars.compile(html);
    return template({
      ...options,
      baseUrl: process.env.BASE_URL_WEB,
    });
  }

  //sendMail function when employee is created
  async sendMail(subject: string, option: Options): Promise<void> {
    const environment = process.env.NODE_ENV;
    if (
      environment === 'development' ||
      environment === 'stage' ||
      environment === 'local' ||
      environment === 'stage-v2' ||
      environment === 'stage-v3'
    ) {
      this.sendMailNodeMailer(subject, option);
    }
    if (environment === 'production') {
      this.sendMailSES(subject, option);
    }
  }

  //send mail node mailer
  async sendMailNodeMailer(subject: string, option: Options): Promise<void> {
    const to = option.email;

    try {
      const html = this.getEmailBody(option);
      await this.transporter.sendMail({
        from: `"${process.env.FROM_EMAIL_NAME}" <${process.env.FROM_EMAIL}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Error sending email', error);
    }
  }

  //send mail ses
  async sendMailSES(subject: string, option: Options): Promise<void> {
    //parameters
    const params: SendEmailRequest = {
      Destination: {
        ToAddresses: [option.email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: this.getEmailBody(option),
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: process.env.FROM_EMAIL,
      ReplyToAddresses: [process.env.FROM_EMAIL],
    };

    try {
      const data = await this.sesClient.send(new SendEmailCommand(params));
      console.log('Success', data);
    } catch (err) {
      console.log('Error', err);
    }
  }

  //check if email
  async checkSESReady() {
    try {
      const response = await this.sesClient.send(new GetSendQuotaCommand({}));
      const { Max24HourSend, MaxSendRate, SentLast24Hours } = response;

      console.log('Max 24-Hour Send Limit:', Max24HourSend);
      console.log('Max Send Rate:', MaxSendRate);
      console.log('Sent Emails in the Last 24 Hours:', SentLast24Hours);

      // Now you can check if you can send more emails based on your limits.
      if (SentLast24Hours < Max24HourSend) {
        console.log('SES is ready to take your messages.');
      } else {
        console.log('You have reached your 24-hour sending limit.');
      }
    } catch (error) {
      console.error('Error checking SES status:', error);
    }
  }

  //check email nodemailer
  async checkNodeMailerReady() {
    // verify connection configuration
    this.transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });
  }
}
