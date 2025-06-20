import { Request } from "express";

export interface ITokenPayload {
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

export interface AuthenticatedRequest extends Request {
  user?: ITokenPayload["user"];
}
