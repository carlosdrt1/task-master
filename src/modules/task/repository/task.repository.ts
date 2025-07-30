import { Injectable } from '@nestjs/common';
import { ITaskRepository } from './task.repository.interface';
import { PrismaService } from '@/database/prisma/prisma.service';
import { TaskWithTodoList } from '../types/task-with-todo.type';
import { TaskInput } from '../types/task-input.type';

@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: TaskInput): Promise<TaskWithTodoList> {
    return this.prismaService.task.create({
      data: {
        title: data.title,
        description: data.description,
        start: data.start,
        end: data.end,
        icon: data.icon,
        color: data.color,
        userId: data.userId,
        todoItems: {
          create: data.todoItems.map((description) => ({
            description,
          })),
        },
      },
      include: {
        todoItems: true,
      },
    });
  }
}
