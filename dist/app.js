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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_errors_1 = __importStar(require("http-errors"));
const general_1 = __importDefault(require("./routes/general"));
const user_1 = __importDefault(require("./routes/user"));
const company_1 = __importDefault(require("./routes/company"));
const userVendor_1 = __importDefault(require("./routes/userVendor"));
const express_session_1 = __importDefault(require("express-session"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://mercebackend.onrender.com"],
    credentials: true,
}));
app.use((0, express_session_1.default)({
    name: validateEnv_1.default.COOKIE_NAME,
    secret: validateEnv_1.default.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30000 * 10 * 10,
        sameSite: "lax",
        httpOnly: false
    },
    rolling: true,
    store: connect_mongo_1.default.create({
        mongoUrl: validateEnv_1.default.MONGO_URL,
    }),
}));
// app.set("trust proxy", 1);
app.use("/api/general", general_1.default);
app.use("/api/users", user_1.default);
app.use("/api/company", company_1.default);
app.use("/api/uservendor", userVendor_1.default);
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404, "Endpoint not found"));
});
app.use((error, req, res, next) => {
    console.log(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if ((0, http_errors_1.isHttpError)(error)) {
        errorMessage = error.message;
        statusCode = error.status;
    }
    res.status(statusCode).json({ error: errorMessage });
});
exports.default = app;
