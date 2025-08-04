import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../repository/task.repository';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskWithTodoList } from '../types/task-with-todo.type';
import { TaskInput } from '../types/task-input.type';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(data: CreateTaskDto, userId: string): Promise<TaskWithTodoList> {
    const inputData: TaskInput = {
      ...data,
      userId,
    };

    return this.taskRepository.create(inputData);
  }

  async getAll(userId: string) {
    return this.taskRepository.findAll(userId);
  }
}
