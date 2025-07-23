import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { RequestAuth } from '@/shared/interfaces/request-auth.interface';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Response } from 'express';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async show(@Req() req: RequestAuth) {
    return this.userService.getById(req.userId);
  }

  @Patch()
  async update(@Req() req: RequestAuth, @Body() body: UpdateUserDto) {
    return this.userService.update(req.userId, body);
  }

  @Delete()
  @HttpCode(204)
  async delete(@Req() req: RequestAuth, @Res() res: Response) {
    await this.userService.delete(req.userId);
    res.clearCookie('token');
    res.send();
  }
}
