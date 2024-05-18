import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import {
  RefreshTokenDto,
  SendEmailDto,
  SignInDto,
  SignUpDto,
  VerifyCodeDto,
} from './dto/auth-credentials-dto';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from 'src/mail/mail.service';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

    // private mailService: MailService,
  ) {}

  @Post('sign-up')
  async registerUser(@Body() user: SignUpDto, @Res() res: Response) {
    const result = await this.authService.createUser(user);
    res.status(200).json(result);
  }
  @Post('sing-in')
  async validateUser(@Body() user: SignInDto, @Res() res: Response) {
    const tokensObj = await this.authService.valdiateUser(
      user.username,
      user.password,
    );

    res.status(200).json(tokensObj);
  }
  @Post('send-code')
  async sendCode(@Body() body: SendEmailDto) {
    return await this.authService.sendOtp(body.email);
  }

  @Post('verify-code')
  async verifyCode(@Body() body: VerifyCodeDto) {
    return this.authService.verifyOtp(body.code);
  }

  @Get('refresh-token/:token')
  async generateRefreshToken(
    @Param('token') refreshToken: string,
    @Res() res: Response,
  ) {
    const accesstoken =
      await this.authService.validateAndGenerateToken(refreshToken);
    res.json(accesstoken);
  }
}
