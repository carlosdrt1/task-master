import { UserResponseFixture } from '../fixture/user-response.fixture';

export const MockUserRepository = {
  create: jest.fn().mockResolvedValue(UserResponseFixture),
};
