import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const Auth: RequestHandler = async (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    next(createHttpError(401, "User Not Authenticated"));
  }
};
