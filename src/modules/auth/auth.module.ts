import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UserModule } from '../user/user.module';
import { SharedModule } from '@/shared/shared.module';

@Module({
  imports: [UserModule, SharedModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
