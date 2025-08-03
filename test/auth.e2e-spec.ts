import { AppModule } from '@/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import * as request from 'supertest';
import { ErrorBodyResponse } from './interfaces/response-error.interface';
import { UserResponse } from './interfaces/user-response.interface';
import { registerLoginUser } from './helpers/register-login.helper';
import { PrismaClient } from '@prisma/client';

describe('Auth (e2e)', () => {
  const prisma = new PrismaClient();
  let app: INestApplication<App>;

  const user = {
    name: 'user',
    email: `emailAuth_${Date.now()}@email.com`,
    password: 'password',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should create an valid user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user)
        .expect(201);
      const body = res.body as UserResponse;

      expect(body).toHaveProperty('id');
      expect(body.name).toBe(user.name);
      expect(body.email).toBe(user.email);
      expect(body).toHaveProperty('createdAt');
      expect(body).toHaveProperty('updatedAt');
    });

    it('should return an 409 if the email is already registered', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user)
        .expect(409);
      const body = res.body as ErrorBodyResponse;

      expect(body.statusCode).toBe(409);
      expect(body.error).toBe('Conflict');
      expect(body.message).toBe('email already registered');
    });

    it('should return an 400 if email is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...user, email: 'wrongmail.com' })
        .expect(400);
      const body = res.body as ErrorBodyResponse;

      expect(body.statusCode).toBe(400);
      expect(body.error).toBe('Bad Request');
      expect(body.message).toEqual(['email must be an email']);
    });

    it('should return 400 if password is shorter than 8 characters', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...user, password: 'pass' })
        .expect(400);
      const body = res.body as ErrorBodyResponse;

      expect(body.statusCode).toBe(400);
      expect(body.error).toBe('Bad Request');
      expect(body.message).toEqual([
        'password must be longer than or equal to 8 characters',
      ]);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should authenticate the user successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);
      const cookies = res.get('Set-Cookie');

      expect(Array.isArray(cookies)).toBe(true);
      expect(cookies![0].startsWith('token=')).toBe(true);
    });

    it('should return 401 when email is incorrect', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'wrong@mail.com', password: 'somePassword' })
        .expect(401);
      const body = res.body as ErrorBodyResponse;

      expect(body.statusCode).toBe(401);
      expect(body.error).toBe('Unauthorized');
      expect(body.message).toEqual('invalid credentials');
    });

    it('should return 401 if password is incorrect', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: 'wrongpass' })
        .expect(401);
      const body = res.body as ErrorBodyResponse;

      expect(body.statusCode).toBe(401);
      expect(body.error).toBe('Unauthorized');
      expect(body.message).toEqual('invalid credentials');
    });
  });

  describe('auth/logout (DELETE)', () => {
    it('should remove the authcookie of the user logged', async () => {
      const { authCookies } = await registerLoginUser(app);

      const res = await request(app.getHttpServer())
        .delete('/auth/logout')
        .set('Cookie', authCookies!)
        .expect(200);

      expect(res.get('Set-Cookie')).toContain(
        'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      );
    });
  });
});
