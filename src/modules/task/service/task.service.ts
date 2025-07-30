import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../repository/task.repository';
import { CreateTaskDto } from '../dto/create-task.dto';
import { zeroTimeDate } from '@/shared/utils/date.util';
import { TaskWithTodoList } from '../types/task-with-todo.type';
import { TaskInput } from '../types/task-input.type';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(data: CreateTaskDto, userId: string): Promise<TaskWithTodoList> {
    const inputData: TaskInput = {
      ...data,
      start: data.start ? zeroTimeDate(data.start) : zeroTimeDate(new Date()),
      end: zeroTimeDate(data.end),
      userId,
    };

    return this.taskRepository.create(inputData);
  }
}
