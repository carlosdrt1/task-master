import { TaskWithTodoList } from '../../types/task-with-todo.type';

export const taskResponseFixture: TaskWithTodoList = {
  id: 'any id',
  title: 'any title',
  description: 'any description',
  start: new Date(),
  end: new Date(),
  icon: 'any',
  color: '#000000',
  userId: 'any id',
  createdAt: new Date(),
  updatedAt: new Date(),
  todoItems: [
    {
      id: 1,
      description: 'create a ER diagram',
      marked: false,
      taskId: '57a78aa6-531f-481c-841c-ccc519f552e5',
    },
  ],
};
