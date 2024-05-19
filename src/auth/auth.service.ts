import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { NotFoundException } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

import { SignInDto, SignUpDto } from './dto/auth-credentials-dto';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}

  async valdiateUser(username: string, password: string) {
    const user = await this.usersService.findOne({
      username,
    });

    if (!user)
      throw new BadRequestException(['The username or password is wrong']);
    if (!compareSync(password, user.password))
      throw new BadRequestException(['The username or password is wrong']);
    const accessToken = this.generateAccessToken({
      id: user.id,
      role: user.role,
    });
    const refreshToken = this.generateRefreshToken({
      id: user.id,
    });
    return { accessToken, refreshToken };
  }
  async createUser(user: SignUpDto) {
    const { email, password, username } = user;
    const findedUser = await this.usersService.findOne({ username });
    const userWithEmail = await this.usersService.findOne({ email });

    if (findedUser)
      throw new BadRequestException(['The username already exists']);
    if (userWithEmail)
      throw new BadRequestException(['The email already exists']);

    const hashedPassword = this.hashPassword(password);
    const createdUser = await this.usersService.create({
      username,
      email,
      password: hashedPassword,
    });

    const accessToken = this.generateAccessToken({
      id: createdUser._id,
      role: createdUser.role,
    });
    const refreshToken = this.generateRefreshToken({
      id: createdUser._id,
    });
    return { accessToken, refreshToken };
  }
  async validateAndGenerateToken(token: string) {
    if (!token) throw new BadRequestException('Token is missing');
    const decoded = verify(token, process.env.REFRESH_KEY) as { id: string };

    const user = await this.usersService.findById(decoded.id);

    return this.generateAccessToken({ id: user._id, role: user.role });
  }
  async sendOtp(email: string) {
    const result = await this.usersService.findOne({
      email,
    });

    this.otpService.sendOtp(email);

    if (result)
      return {
        message: `email send to ${email}`,
        userRegistered: true,
      };

    return {
      message: `email send to ${email}`,
      userRegistered: false,
    };
  }

  async verifyOtp(code: string) {
    const result = await this.otpService.verifyOtp(code);

    const user = await this.usersService.findOne({
      email: result.email,
    });

    if (user) {
      const accessToken = this.generateAccessToken({
        id: user.id,
        role: user.role,
      });
      const refreshToken = this.generateRefreshToken({
        id: user.id,
      });

      return { accessToken, refreshToken };
    } else {
      const createUser = await this.usersService.create({
        email: result.email,
        username: result.email,
        password: '',
      });
      console.log(createUser);
      const accessToken = this.generateAccessToken({
        id: createUser.id,
        role: createUser.role,
      });
      const refreshToken = this.generateRefreshToken({
        id: createUser.id,
      });

      return { accessToken, refreshToken };
    }
  }
  private hashPassword(password) {
    try {
      const saltRounds = 10;
      return hashSync(password, saltRounds);
    } catch (error) {
      console.log(error);
    }
  }
  private generateAccessToken(payload: object) {
    try {
      return sign(payload, process.env.SECRET_KEY, {
        expiresIn: '1d',
      });
    } catch (error) {
      console.log(error);
    }
  }
  private generateRefreshToken(payload: object) {
    return sign(payload, process.env.REFRESH_KEY);
  }
}
