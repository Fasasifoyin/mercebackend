"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    isUser: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("User", userSchema);
