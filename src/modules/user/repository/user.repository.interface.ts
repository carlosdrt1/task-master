import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';

export interface IUserRepository {
  create(data: CreateUserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
}
