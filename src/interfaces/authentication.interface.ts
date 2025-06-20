import { Request } from "express";

export interface ITokenPayload {
  usuario: {
    id: string;
  };
}

export interface AuthenticatedRequest extends Request {
  usuario?: ITokenPayload["usuario"];
}
