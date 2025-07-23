import { Request } from 'express';

export interface RequestAuth extends Request {
  userId: string;
  cookies: { token?: string };
}
