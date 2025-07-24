import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import * as request from 'supertest';
import { UserResponse } from 'test/interfaces/user-response.interface';

export async function registerLoginUser(app: INestApplication<App>) {
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

  return { authCookies: res.get('Set-Cookie'), user, userData };
}
