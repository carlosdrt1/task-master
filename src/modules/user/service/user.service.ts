import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../dto/user-response.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.create(data);
    return plainToInstance(UserResponseDto, user);
  }

  async getByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByEmail(email);
    return plainToInstance(UserResponseDto, user, {
      groups: ['internal'],
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.userRepository.existsByEmail(email);
  }

  async getById(id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id);
    return plainToInstance(UserResponseDto, user);
  }

  async checkEmailConflict(email: string, id: string): Promise<void> {
    const user = await this.getByEmail(email);
    if (user && user.id !== id) {
      throw new ConflictException('email already registered');
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    if (data.email) {
      await this.checkEmailConflict(data.email, id);
    }

    const user = await this.userRepository.update(id, data);
    return plainToInstance(UserResponseDto, user);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
