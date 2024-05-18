import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'rainbowsixsige19@gmail.com',
          pass: 'qjby xnur olgr ubub',
        },
        tls: {
          rejectUnauthorized: true,
        },
      },
      defaults: {
        from: '"Store Nest" <noreply@example.com>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // Export for DI
})
export class MailModule {}
