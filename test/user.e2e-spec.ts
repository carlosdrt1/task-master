import { AppModule } from '@/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import * as request from 'supertest';
import { ErrorBodyResponse } from './interfaces/response-error.interface';
import { PrismaClient } from '@prisma/client';
import { UserResponse } from './interfaces/user-response.interface';
import * as cookieParser from 'cookie-parser';

describe('User (e2e)', () => {
  const prisma = new PrismaClient();
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should return 401 error when no auth token is provided', async () => {
    const res = await request(app.getHttpServer()).get('/users').expect(401);

    expect(res.body).toStrictEqual({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'No token provided',
    });
  });

  describe('/users (GET)', () => {
    it('should return the user data', async () => {
      const { user, authCookies } = await registerLoginUser(app);
      const res = await request(app.getHttpServer())
        .get('/users')
        .set('Cookie', authCookies!)
        .expect(200);

      const body = res.body as UserResponse;

      expect(body).toStrictEqual({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });
  });

  describe('/users (PATCH)', () => {
    it('should update the user data when valid input is provided', async () => {
      const { user, authCookies } = await registerLoginUser(app);
      const res = await request(app.getHttpServer())
        .patch('/users')
        .set('Cookie', authCookies!)
        .send({ name: 'newUserName', email: 'newemail@email.com' })
        .expect(200);

      const body = res.body as UserResponse;

      expect(body.id).toBe(user.id);
      expect(body.name).toBe('newUserName');
      expect(body.email).toBe('newemail@email.com');
      expect(body.createdAt).toBe(user.createdAt);
      expect(typeof body.updatedAt).toBe('string');
    });

    it('should return 400 when the data for update is invalid', async () => {
      const { authCookies } = await registerLoginUser(app);
      const res = await request(app.getHttpServer())
        .patch('/users')
        .set('Cookie', authCookies!)
        .send({ email: 'invalidEmail.com' })
        .expect(400);

      const body = res.body as ErrorBodyResponse;

      expect(body.statusCode).toBe(400);
      expect(body.error).toBe('Bad Request');
      expect(body.message).toEqual(['email must be email']);
    });

    it('should return 409 if the email passed is already registered', async () => {
      const { authCookies } = await registerLoginUser(app);
      const existUser = (await registerLoginUser(app)).user;
      const res = await request(app.getHttpServer())
        .patch('/users')
        .set('Cookie', authCookies!)
        .send({ email: existUser.email })
        .expect(409);

      const body = res.body as ErrorBodyResponse;

      expect(body.statusCode).toBe(409);
      expect(body.error).toBe('Conflict');
      expect(body.message).toBe('email already registered');
    });
  });

  describe('/users (DELETE)', () => {
    it('should delete the user account', async () => {
      const { authCookies } = await registerLoginUser(app);
      const res = await request(app.getHttpServer())
        .delete('/users')
        .set('Cookie', authCookies!)
        .expect(204);

      expect(res.body).toEqual({});
    });
  });
});

async function registerLoginUser(app: INestApplication<App>) {
  const userData = {
    name: 'user',
    email: `user_${Date.now()}@email.com`,
    password: 'password',
  };

  const resRegister = await request(app.getHttpServer())
    .post('/auth/register')
    .send(userData)
    .expect(201);

  const user = resRegister.body as UserResponse;

  const res = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: userData.email, password: userData.password })
    .expect(200);

  return { authCookies: res.get('Set-Cookie'), user };
}
