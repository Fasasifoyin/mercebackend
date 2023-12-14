import { RequestHandler } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { toSlug } from "../utils/MakeSlug";
import crypto from "crypto";

type SIGNUPBODY = {
  userName?: string;
  email?: string;
  phone?: number;
  password?: string;
};

export const SIGNUP: RequestHandler<
  unknown,
  unknown,
  SIGNUPBODY,
  unknown
> = async (req, res, next) => {
  const { userName, email, phone, password: passwordRaw } = req.body;
  try {
    if (!userName || !email || !phone || !passwordRaw) {
      throw createHttpError(400, "Parameters missing");
    }

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      throw createHttpError(409, "User already exist");
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw createHttpError(409, "E-mail already exist");
    }

    let slug = toSlug(userName);
    const checkSlug = await User.findOne({ slug });
    if (checkSlug) {
      const id = crypto.randomUUID();
      slug = `${slug}-${id}`;
    }

    const passwordHash = await bcrypt.hash(passwordRaw, 10);

    const newUser = await User.create({
      userName,
      email,
      phone,
      password: passwordHash,
      slug
    });

    req.session.userId = newUser._id;

    res.status(201).json({
      _id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
      phone: newUser.phone,
      slug: newUser.slug,
      isUser: newUser.isUser,
    });
  } catch (error) {
    next(error);
  }
};

type SIGNINBODY = {
  userName?: string;
  password?: string;
};

export const SIGNIN: RequestHandler<
  unknown,
  unknown,
  SIGNINBODY,
  unknown
> = async (req, res, next) => {
  const { userName, password } = req.body;
  try {
    if (!userName || !password) {
      throw createHttpError(400, "Paremeters missing");
    }

    const existingUser = await User.findOne({ userName }).select("+password");
    if (!existingUser) {
      throw createHttpError(409, "Invalid credentials");
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      throw createHttpError(401, "Invalid credentials");
    }

    req.session.userId = existingUser._id;

    res.status(200).json({
      _id: existingUser._id,
      userName: existingUser.userName,
      email: existingUser.email,
      phone: existingUser.phone,
      slug: existingUser.slug,
      isUser: existingUser.isUser,
    });
  } catch (error) {
    next(error);
  }
};

// export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
//   const authenticatedUserId = req.session.userId;

//   try {
//     if (!authenticatedUserId) {
//       throw createHttpError(401, "User not authenticated");
//     }

//     const user = await User.findById(authenticatedUserId);
//     res.status(200).json(user);
//   } catch (error) {
//     next(error);
//   }
// };