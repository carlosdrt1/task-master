import { Body, ConflictException, Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/service/user.service';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { UserResponseDto } from '@/modules/user/dto/user-response.dto';
import { HashService } from '@/shared/hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
  ) {}

  async register(data: CreateUserDto): Promise<UserResponseDto> {
    if (await this.userService.existsByEmail(data.email)) {
      throw new ConflictException('email already registered');
    }

    const hashedPassword = await this.hashService.hashPassword(data.password);
    return this.userService.create({ ...data, password: hashedPassword });
  }
}
