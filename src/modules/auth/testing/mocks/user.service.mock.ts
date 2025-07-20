import { UserInternalFixture } from '@/modules/user/testing/fixture/user-internal.fixture';
import { UserResponseFixture } from '@/modules/user/testing/fixture/user-response.fixture';

export const MockUserService = {
  create: jest.fn().mockResolvedValue(UserResponseFixture),
  existsByEmail: jest.fn().mockResolvedValue(false),
  getByEmail: jest.fn().mockResolvedValue(UserInternalFixture),
};
