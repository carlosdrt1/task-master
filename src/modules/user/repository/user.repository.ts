import { Injectable } from '@nestjs/common';
import { IUserRepository } from './user.repository.interface';
import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({ data });
  }
}
