import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TaskController } from './controller/task.controller';
import { PrismaService } from '@/database/prisma/prisma.service';
import { TaskService } from './service/task.service';
import { TaskRepository } from './repository/task.repository';

@Module({
  imports: [AuthModule],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository, PrismaService],
})
export class TaskModule {}
