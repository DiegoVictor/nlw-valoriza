import { unauthorized } from "@hapi/boom";
import { NextFunction, Request, Response } from "express";

export default (request: Request, _: Response, next: NextFunction) => {
  const admin = request.headers.admin || false;

  if (admin) {
    return next();
  }

  throw unauthorized('You are not authorized', 'sample', { code: 341 })
}
