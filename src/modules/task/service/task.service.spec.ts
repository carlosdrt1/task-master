import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepository } from '../repository/task.repository';
import { taskCreateFixture } from '../testing/fixtures/task-create.fixture';
import { taskResponseFixture } from '../testing/fixtures/task-response.fixture';
import { taskRepositoryMock } from '../testing/mocks/task.repository.mock';

describe('TaskService', () => {
  let taskService: TaskService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: TaskRepository, useValue: taskRepositoryMock },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('validate definition', () => {
    expect(taskService).toBeDefined();
  });

  describe('create a task', () => {
    it('should create a task with the data send', async () => {
      const result = await taskService.create(taskCreateFixture, 'any-id');

      expect(result).toEqual(taskResponseFixture);
      expect(taskRepositoryMock.create).toHaveBeenCalledWith({
        ...taskCreateFixture,
        userId: 'any-id',
      });
    });
  });

  describe('get all tasks', () => {
    it('should return an array of tasks', async () => {
      const result = await taskService.getAll('any-id');

      expect(Array.isArray(result)).toBeTruthy();
      expect(taskRepositoryMock.findAll).toHaveBeenCalledWith('any-id');
    });
  });
});
