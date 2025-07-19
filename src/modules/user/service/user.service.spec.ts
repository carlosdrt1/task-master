import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MockUserRepository } from '../testing/mock/user.repository.mock';
import { MockHashService } from '../testing/mock/hash.service.mock';
import { HashService } from '@/shared/hash/hash.service';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserCreateFixture } from '../testing/fixture/user-create.fixture';
import { UserResponseFixture } from '../testing/fixture/user-response.fixture';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: MockUserRepository },
        { provide: HashService, useValue: MockHashService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('validate definition', () => {
    expect(userService).toBeDefined();
  });

  describe('create user', () => {
    it('should return a created user', async () => {
      const data: CreateUserDto = UserCreateFixture;
      const result = await userService.create(data);

      expect(result).toEqual(UserResponseFixture);
      expect(MockHashService.hashPassword).toHaveBeenCalledWith(data.password);
      expect(MockUserRepository.create).toHaveBeenCalledWith({
        ...data,
        password: `hashed-password`,
      });
    });
  });
});
