import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { SharedModule } from '@/shared/shared.module';
import { UserRepository } from './repository/user.repository';
import { PrismaService } from '@/database/prisma/prisma.service';

@Module({
  imports: [SharedModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService],
})
export class UserModule {}
