import { UserInternalFixture } from '../fixture/user-internal.fixture';
import { UserResponseFixture } from '../fixture/user-response.fixture';

export const MockUserRepository = {
  create: jest.fn().mockResolvedValue(UserResponseFixture),
  findByEmail: jest.fn().mockResolvedValue(UserInternalFixture),
  existsByEmail: jest.fn().mockResolvedValue(true),
  findById: jest.fn().mockResolvedValue(UserResponseFixture),
  update: jest.fn().mockResolvedValue(UserResponseFixture),
  delete: jest.fn().mockResolvedValue(undefined),
};
