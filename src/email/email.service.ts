import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

export enum EmailTemplates {
  NOTIFICATION = 'd-49ec9f8f435b4eb08bd20331618f3e3a',
}

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    sgMail.setApiKey(configService.get<string>('SENDGRID_API_KEY'));
  }
  async sendMail(to: string, subject: string, html: string) {
    const msg = {
      to,
      from: this.configService.get<string>('FROM_ADDRESS'),
      subject,
      html,
    };

    try {
      await sgMail.send(msg);
      return { success: true };
    } catch (err) {
      console.error('Sendgrid error:', err);
      if (err.response) {
        console.error('Sendgrid error response:', err.response.body);
      }
      throw err;
    }
  }
  async sendDynamicMail(
    to: string,
    subject: string,
    templateId: EmailTemplates,
    dynamicTemplateData: Record<string, any>,
  ) {
    const msg = {
      to,
      from: this.configService.get<string>('FROM_ADDRESS'),
      subject,
      templateId,
      dynamicTemplateData,
    };

    try {
      await sgMail.send(msg);
      return { success: true };
    } catch (err) {
      console.error('Sendgrid error:', err);
      if (err.response) {
        console.error('Sendgrid error response:', err.response.body);
      }
      throw err;
    }
  }
}
