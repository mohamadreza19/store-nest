import { BadRequestException, Injectable } from '@nestjs/common';
import { OtpDocument } from './entities/opt.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MailService } from 'src/mail/mail.service';
import { generate } from 'otp-generator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel('otps')
    private readonly otpModel: Model<OtpDocument>,
    private mailService: MailService,
  ) {}

  async sendOtp(email: string) {
    const code = generate(5, {
      digits: true,
      specialChars: false,
    });

    await this.otpModel.create({
      code: code,
      email,
    });

    await this.mailService.snedTemporayCode(code, email);
  }
  async verifyOtp(code: string) {
    const result = await this.otpModel.findOne({
      code,
    });

    if (!result) throw new BadRequestException(['gaven code is wrong']);

    return result;
  }
}
