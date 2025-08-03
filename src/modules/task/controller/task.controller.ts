import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { TaskService } from '../service/task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { RequestAuth } from '@/shared/interfaces/request-auth.interface';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Req() req: RequestAuth, @Body() body: CreateTaskDto) {
    return this.taskService.create(body, req.userId);
  }

  @Get()
  async index(@Req() req: RequestAuth) {
    return this.taskService.getAll(req.userId);
  }
}
