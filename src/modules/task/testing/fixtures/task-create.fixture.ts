import { CreateTaskDto } from '../../dto/create-task.dto';

export const taskCreateFixture: CreateTaskDto = {
  title: 'any title',
  description: 'any description',
  start: new Date(),
  end: new Date(),
  icon: 'any',
  color: '#000000',
  todoItems: ['any item', 'any item 2'],
};
