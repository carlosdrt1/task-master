import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '@/modules/user/service/user.service';
import { HashService } from '@/shared/hash/hash.service';
import { MockUserService } from '../testing/mocks/user.service.mock';
import { MockHashService } from '../testing/mocks/hash.service.mock';
import { JwtService } from '@nestjs/jwt';
import { MockJwtService } from '../testing/mocks/jwt.service.mock';
import { UserCreateFixture } from '@/modules/user/testing/fixture/user-create.fixture';
import { UserResponseFixture } from '@/modules/user/testing/fixture/user-response.fixture';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { LoginFixture } from '../testing/fixture/login.fixture';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: MockUserService },
        { provide: HashService, useValue: MockHashService },
        { provide: JwtService, useValue: MockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('validate definition', () => {
    expect(authService).toBeDefined();
  });

  describe('register user', () => {
    it('should register a new user', async () => {
      const user = UserCreateFixture;
      const result = await authService.register(user);

      expect(result).toEqual(UserResponseFixture);
      expect(MockUserService.existsByEmail).toHaveBeenCalledWith(user.email);
      expect(MockHashService.hashPassword).toHaveBeenCalledWith(user.password);
      expect(MockUserService.create).toHaveBeenCalledWith({
        ...user,
        password: 'password-hashed',
      });
    });

    it('should throw an ConflictException if email is already registered', async () => {
      MockUserService.existsByEmail.mockResolvedValue(true);
      const user = UserCreateFixture;

      await expect(authService.register(user)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login user', () => {
    it('should return a valid token', async () => {
      const loginData = LoginFixture;
      const result = await authService.login(loginData);

      expect(result).toEqual('signedValidToken');
    });

    it('should throw a UnauthorizedException if user was not found', async () => {
      MockUserService.getByEmail.mockResolvedValue(null);
      const user = LoginFixture;

      await expect(authService.login(user)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw a UnauthorizedException if password was incorrect', async () => {
      MockHashService.verifyPassword.mockResolvedValue(false);
      const user = LoginFixture;

      await expect(authService.login(user)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
