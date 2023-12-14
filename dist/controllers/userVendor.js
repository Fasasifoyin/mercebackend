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
exports.getCompany = exports.getCompanies = void 0;
const company_1 = __importDefault(require("../models/company"));
const http_errors_1 = __importDefault(require("http-errors"));
const getCompanies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page } = req.query;
        if (!page) {
            throw (0, http_errors_1.default)(400, "A pagination number was not sent via query");
        }
        const LIMIT = 10;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = yield company_1.default.countDocuments({});
        const companies = yield company_1.default.find()
            .sort({ _id: -1 })
            .limit(LIMIT)
            .skip(startIndex);
        res
            .status(200)
            .json({ data: companies, totalPages: Math.ceil(total / LIMIT) });
    }
    catch (error) {
        next(error);
    }
});
exports.getCompanies = getCompanies;
const getCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        if (!slug) {
            throw (0, http_errors_1.default)("400", "Parameter missing");
        }
        const company = yield company_1.default.findOne({ slug });
        if (!company) {
            throw (0, http_errors_1.default)("400", "Vendor does not exist");
        }
        res.status(200).json(company);
    }
    catch (error) {
        next(error);
    }
});
exports.getCompany = getCompany;
