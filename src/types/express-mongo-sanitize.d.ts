declare module "express-mongo-sanitize" {
  import { RequestHandler } from "express";
  function sanitize(options?: any): RequestHandler;
  namespace sanitize {}
  export = sanitize;
}
