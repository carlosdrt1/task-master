import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';

export interface IUserRepository {
  create(data: CreateUserDto): Promise<User>;
}
