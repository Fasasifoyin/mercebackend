import { RequestHandler } from "express";

export const LOGOUT: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({ message: "Logout successful" });
    }
  });
};

export const isLoggedIn: RequestHandler = async (req, res) => {
  res.status(200).json({ message: "Is logged in" });
};
