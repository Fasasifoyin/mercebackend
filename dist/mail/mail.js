"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailgen_1 = __importDefault(require("mailgen"));
const dotenv = __importStar(require("dotenv"));
const validateEnv_1 = __importDefault(require("../utils/validateEnv"));
dotenv.config();
const sendMail = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, text, subject } = body;
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: validateEnv_1.default.USER,
                clientId: validateEnv_1.default.CLIENT_ID,
                clientSecret: validateEnv_1.default.CLIENT_SECRET,
                refreshToken: validateEnv_1.default.REFRESH_TOKEN,
                accessToken: validateEnv_1.default.ACCESS_TOKEN,
                tls: {
                    rejectUnauthorized: false,
                },
            },
        });
        let MailGenerator = new mailgen_1.default({
            theme: "default",
            product: {
                name: "Foodmerce",
                link: "https://shome.js",
            },
        });
        let response = {
            body: {
                name,
                intro: text,
                outro: "Need help? Send a message to this email",
            },
        };
        let mail = MailGenerator.generate(response);
        let message = {
            from: validateEnv_1.default.USER,
            to: email,
            subject: subject,
            html: mail,
        };
        yield transporter.sendMail(message);
        return { message: "Success", status: 201 };
    }
    catch (error) {
        let errorMessage = "An error occured while sending email";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return { message: errorMessage, status: 500 };
    }
});
exports.sendMail = sendMail;
