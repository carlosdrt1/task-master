import { AppModule } from '@/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import * as request from 'supertest';
import { ErrorBodyResponse } from './interfaces/response-error.interface';
import { UserResponse } from './interfaces/user-response.interface';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    const user = {
      name: 'user',
      email: 'email@email.com',
      password: 'password',
    };

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

    it('should return a error with a message that email has already been registered', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user)
        .expect(409);
      const body = res.body as ErrorBodyResponse;

      expect(body.statusCode).toBe(409);
      expect(body.error).toBe('Conflict');
      expect(body.message).toBe('email already registered');
    });

    it('should return a error with messages if email is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...user, email: 'wrongmail.com' })
        .expect(400);
      const body = res.body as ErrorBodyResponse;

      expect(body.statusCode).toBe(400);
      expect(body.error).toBe('Bad Request');
      expect(body.message).toEqual(['email must be an email']);
    });

    it('should return a error with messages if password is shorter than 8 characters', async () => {
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
          email: 'email@email.com',
          password: 'password',
        })
        .expect(200);
      const cookies = res.get('Set-Cookie');

      expect(Array.isArray(cookies)).toBe(true);
      expect(cookies![0].startsWith('token=')).toBe(true);
    });

    it('should return a error with message if email is incorrect', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'wrong@mail.com', password: 'password' })
        .expect(401);
      const body = res.body as ErrorBodyResponse;

      expect(body.statusCode).toBe(401);
      expect(body.error).toBe('Unauthorized');
      expect(body.message).toEqual('invalid credentials');
    });

    it('should return a error with message if password is incorrect', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'email@mail.com', password: 'wrongpass' })
        .expect(401);
      const body = res.body as ErrorBodyResponse;

      expect(body.statusCode).toBe(401);
      expect(body.error).toBe('Unauthorized');
      expect(body.message).toEqual('invalid credentials');
    });
  });
});
