import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserInternalDto } from '../dto/user-internal.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.create(data);
    return plainToInstance(UserResponseDto, user);
  }

  async getByEmail(email: string): Promise<UserInternalDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('user not found');

    return plainToInstance(UserInternalDto, user);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.userRepository.existsByEmail(email);
  }
}
