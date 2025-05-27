import { Request, Response } from 'express';

export interface CustomRequest<T> extends Request {
  body: T;
}

export interface CustomResponse extends Response {}

export interface User {
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: string;
  location?: string;
  email?: string;
  password?: string;
}