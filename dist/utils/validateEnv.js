"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const validators_1 = require("envalid/dist/validators");
exports.default = (0, envalid_1.cleanEnv)(process.env, {
    NODE_ENV: (0, validators_1.str)(),
    MONGO_URL: (0, validators_1.str)(),
    PORT: (0, validators_1.port)(),
    SESSION_KEY: (0, validators_1.str)(),
    COOKIE_NAME: (0, validators_1.str)(),
    USER: (0, validators_1.str)(),
    CLIENT_ID: (0, validators_1.str)(),
    CLIENT_SECRET: (0, validators_1.str)(),
    REFRESH_TOKEN: (0, validators_1.str)(),
    ACCESS_TOKEN: (0, validators_1.str)(),
    CLOUDINARY_CLOUD_NAME: (0, validators_1.str)(),
    CLOUDINARY_API_KEY: (0, validators_1.str)(),
    CLOUDINARY_API_SECRET: (0, validators_1.str)(),
});
