import { TaskInput } from '../types/task-input.type';
import { TaskWithTodoList } from '../types/task-with-todo.type';

export interface ITaskRepository {
  create(task: TaskInput, userId: string): Promise<TaskWithTodoList>;
}
