import { Response } from 'express';

export interface ErrorBodyResponse {
  message: string[] | string;
  error: string;
  statusCode: number;
}
