import { CreateTaskDto } from '../dto/create-task.dto';

export type TaskInput = CreateTaskDto & {
  userId: string;
};
