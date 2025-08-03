import { AppModule } from '@/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { registerLoginUser } from './helpers/register-login.helper';
import { TaskWithTodoList } from '@/modules/task/types/task-with-todo.type';
import { ErrorBodyResponse } from './interfaces/response-error.interface';

describe('Task (e2e)', () => {
  const prisma = new PrismaClient();
  let app: INestApplication<App>;

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
    app.use(cookieParser());

    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('/tasks (POST)', () => {
    it('should create a task successfully', async () => {
      const task = {
        title: 'any-title',
        description: 'any-description',
        start: '2025-08-03',
        end: '2025-08-20',
        todoItems: ['item', 'item2', 'item3'],
      };
      const { authCookies } = await registerLoginUser(app);

      const res = await request(app.getHttpServer())
        .post('/tasks')
        .send(task)
        .set('Cookie', authCookies!)
        .expect(201);

      const body = res.body as TaskWithTodoList;

      expect(typeof body.id).toBe('string');
      expect(body.title).toBe('any-title');
      expect(body.description).toBe('any-description');
      expect(body.start).toBe('2025-08-03T00:00:00.000Z');
      expect(body.end).toBe('2025-08-20T00:00:00.000Z');
      expect(body.todoItems.map((item) => item.description)).toStrictEqual(
        task.todoItems,
      );
    });

    it('should return 400 error when the task data is invalid', async () => {
      const task = {
        title: 'sh',
        description: 123,
        start: '2025-08-03',
        todoItems: ['item', 'item2', 'item3'],
      };
      const { authCookies } = await registerLoginUser(app);

      const res = await request(app.getHttpServer())
        .post('/tasks')
        .send(task)
        .set('Cookie', authCookies!)
        .expect(400);

      const body = res.body as ErrorBodyResponse;

      expect(body.message).toStrictEqual([
        'title must be longer than or equal to 3 characters',
        'description must be longer than or equal to 1 and shorter than or equal to 255 characters',
        'description must be a string',
        'end must be a Date instance',
        'end should not be empty',
      ]);
    });

    it('should return 401 error when no auth token is provided', async () => {
      const res = await request(app.getHttpServer()).post('/tasks').expect(401);

      expect(res.body).toStrictEqual({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'No token provided',
      });
    });
  });
});
