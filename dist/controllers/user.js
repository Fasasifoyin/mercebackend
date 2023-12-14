"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIGNIN = exports.SIGNUP = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_errors_1 = __importDefault(require("http-errors"));
const MakeSlug_1 = require("../utils/MakeSlug");
const crypto_1 = __importDefault(require("crypto"));
const SIGNUP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, phone, password: passwordRaw } = req.body;
    try {
        if (!userName || !email || !phone || !passwordRaw) {
            throw (0, http_errors_1.default)(400, "Parameters missing");
        }
        const existingUser = yield user_1.default.findOne({ userName });
        if (existingUser) {
            throw (0, http_errors_1.default)(409, "User already exist");
        }
        const existingEmail = yield user_1.default.findOne({ email });
        if (existingEmail) {
            throw (0, http_errors_1.default)(409, "E-mail already exist");
        }
        let slug = (0, MakeSlug_1.toSlug)(userName);
        const checkSlug = yield user_1.default.findOne({ slug });
        if (checkSlug) {
            const id = crypto_1.default.randomUUID();
            slug = `${slug}-${id}`;
        }
        const passwordHash = yield bcryptjs_1.default.hash(passwordRaw, 10);
        const newUser = yield user_1.default.create({
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
    }
    catch (error) {
        next(error);
    }
});
exports.SIGNUP = SIGNUP;
const SIGNIN = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, password } = req.body;
    try {
        if (!userName || !password) {
            throw (0, http_errors_1.default)(400, "Paremeters missing");
        }
        const existingUser = yield user_1.default.findOne({ userName }).select("+password");
        if (!existingUser) {
            throw (0, http_errors_1.default)(409, "Invalid credentials");
        }
        const matchPassword = yield bcryptjs_1.default.compare(password, existingUser.password);
        if (!matchPassword) {
            throw (0, http_errors_1.default)(401, "Invalid credentials");
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
    }
    catch (error) {
        next(error);
    }
});
exports.SIGNIN = SIGNIN;
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
