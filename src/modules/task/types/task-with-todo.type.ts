import { Task, TodoItem } from '@prisma/client';

export type TaskWithTodoList = Task & {
  todoItems: TodoItem[];
};
