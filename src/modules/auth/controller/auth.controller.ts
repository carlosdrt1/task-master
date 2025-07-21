import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Res() res: Response, @Body() body: LoginDto) {
    const token = await this.authService.login(body);
    res.cookie('token', token);
    return res.status(200).json({ message: 'login successful' });
  }
}
