import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { HashService } from '@/shared/hash/hash.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await this.hashService.hashPassword(data.password);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return plainToInstance(UserResponseDto, user);
  }

  async getByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('user not found');

    return plainToInstance(UserResponseDto, user);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.userRepository.existsByEmail(email);
  }
}
