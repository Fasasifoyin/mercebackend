"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const companySchema = new mongoose_1.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true,
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: [Number],
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
    companyCode: {
        type: String,
        required: true,
        select: false,
    },
    companyAddress: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    website: {
        type: String,
    },
    delivery: {
        type: Boolean,
    },
    delivery_fee: {
        type: Number,
    },
    free_delivery_amount: {
        type: Number,
    },
    delivery_zip_codes: {
        type: [Number],
    },
    order_lead_time: {
        type: Number,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    isCompany: {
        type: Boolean,
        default: true,
    },
    companyImage: {
        type: String,
        default: "https://res.cloudinary.com/dbxvk3apv/image/upload/v1701159540/Food/Popular-Nigerian-Food_rjz3dp.webp",
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Company", companySchema);
