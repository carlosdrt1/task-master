import { taskResponseFixture } from '../fixtures/task-response.fixture';

export const taskRepositoryMock = {
  create: jest.fn().mockResolvedValue(taskResponseFixture),
};
