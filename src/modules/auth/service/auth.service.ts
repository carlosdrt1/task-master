import {
  Body,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/modules/user/service/user.service';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { UserResponseDto } from '@/modules/user/dto/user-response.dto';
import { HashService } from '@/shared/hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: CreateUserDto): Promise<UserResponseDto> {
    if (await this.userService.existsByEmail(data.email)) {
      throw new ConflictException('email already registered');
    }

    const hashedPassword = await this.hashService.hashPassword(data.password);
    return this.userService.create({ ...data, password: hashedPassword });
  }

  async login(data: LoginDto): Promise<string> {
    const user = await this.userService.getByEmail(data.email);
    if (!user) throw new UnauthorizedException('invalid credentials');

    const result = await this.hashService.verifyPassword(
      user.password,
      data.password,
    );
    if (!result) throw new UnauthorizedException('invalid credentials');

    return this.jwtService.sign({
      id: user.id,
    });
  }
}
