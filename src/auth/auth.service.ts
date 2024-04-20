import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { NotFoundException } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

import { SignInDto } from './dto/auth-credentials-dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async valdiateUser(username: string, password: string) {
    const user = await this.usersService.findOne({
      username,
    });

    if (!user) throw new NotFoundException('The username or password is wrong');
    if (!compareSync(password, user.password))
      throw new NotFoundException('The username or password is wrong');
    const accessToken = this.generateAccessToken({
      id: user.id,
    });
    const refreshToken = this.generateRefreshToken({
      id: user.id,
    });
    return { accessToken, refreshToken };
  }
  async createUser(user: SignInDto) {
    const { email, password, username } = user;
    const findedUser = await this.usersService.findOne({ username });
    const userWithEmail = await this.usersService.findOne({ email });

    if (findedUser)
      throw new BadRequestException('The username already exists');
    if (userWithEmail)
      throw new BadRequestException('The email already exists');

    const hashedPassword = this.hashPassword(password);
    const createdUser = await this.usersService.create({
      username,
      email,
      password: hashedPassword,
    });

    const accessToken = this.generateAccessToken({
      id: createdUser._id,
    });
    const refreshToken = this.generateRefreshToken({
      id: createdUser._id,
    });
    return { accessToken, refreshToken };
  }
  async validateAndGenerateToken(token: string) {
    if (!token) throw new BadRequestException('Token is missing');
    const decoded = verify(token, process.env.REFRESH_KEY) as { id: string };

    return this.generateAccessToken({ id: decoded.id });
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
