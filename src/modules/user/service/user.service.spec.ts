import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MockUserRepository } from '../testing/mock/user.repository.mock';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserCreateFixture } from '../testing/fixture/user-create.fixture';
import { UserResponseFixture } from '../testing/fixture/user-response.fixture';
import { UserInternalFixture } from '../testing/fixture/user-internal.fixture';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: MockUserRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('validate definition', () => {
    expect(userService).toBeDefined();
  });

  describe('create user', () => {
    it('should return a created user', async () => {
      const data: CreateUserDto = UserCreateFixture;
      const result = await userService.create(data);

      expect(result).toEqual(UserResponseFixture);
      expect(MockUserRepository.create).toHaveBeenCalledWith(data);
    });
  });

  describe('get user by email', () => {
    it('should return a user', async () => {
      const email: string = 'user@email.com';
      const result = await userService.getByEmail(email);

      expect(result).toEqual(UserInternalFixture);
      expect(MockUserRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it('return null if user was not found', async () => {
      const email: string = 'notfound@gmail.com';
      MockUserRepository.findByEmail.mockResolvedValue(null);
      const result = await userService.getByEmail(email);

      expect(result).toBe(null);
      expect(MockUserRepository.findByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('verify if user exists by email', () => {
    it('should return true if user exists', async () => {
      const email: string = 'user@email.com';
      const result = await userService.existsByEmail(email);

      expect(result).toBe(true);
      expect(MockUserRepository.existsByEmail).toHaveBeenCalledWith(email);
    });

    it('should return false if user was not found', async () => {
      const email: string = 'notfound@gmail.com';
      MockUserRepository.existsByEmail.mockResolvedValue(false);
      const result = await userService.existsByEmail(email);

      expect(result).toBe(false);
      expect(MockUserRepository.existsByEmail).toHaveBeenCalledWith(email);
    });
  });
});
