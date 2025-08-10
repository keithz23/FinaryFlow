import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendForgotPasswordEmail(email: string, token: string, name: string) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: 'forgot-password',
      context: {
        name,
        resetUrl,
        expireTime: '5 minutes',
      },
    });
  }

  async sendPasswordResetConfirmation(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Successful',
      template: 'password-reset-success',
      context: {
        name,
        loginUrl: `${process.env.CLIENT_URL}/login`,
      },
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to EcomGrove',
      template: 'welcome',
      context: {
        name,
        loginUrl: `${process.env.CLIENT_URL}/login`,
      },
    });
  }
}
