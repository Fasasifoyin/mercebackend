import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const Auth: RequestHandler = async (req, res, next) => {
  if (req.session.userId || req.session.companyId) {
    next();
  } else {
    next(createHttpError(401, "Not Authenticated"));
  }
};
