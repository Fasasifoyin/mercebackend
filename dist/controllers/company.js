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
exports.UPDATECOMPANYIMAGE = exports.UPDATEDETAILS = exports.GETAUTHCOMPANY = exports.COMPANYSIGNIN = exports.COMPANYSIGNUP = void 0;
const company_1 = __importDefault(require("../models/company"));
const http_errors_1 = __importDefault(require("http-errors"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const mail_1 = require("../mail/mail");
const MakeSlug_1 = require("../utils/MakeSlug");
const cloudinary_1 = require("cloudinary");
const validateEnv_1 = __importDefault(require("../utils/validateEnv"));
cloudinary_1.v2.config({
    cloud_name: validateEnv_1.default.CLOUDINARY_CLOUD_NAME,
    api_key: validateEnv_1.default.CLOUDINARY_API_KEY,
    api_secret: validateEnv_1.default.CLOUDINARY_API_SECRET,
});
const COMPANYSIGNUP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyName, companyEmail, phone, country, state, city, companyAddress, password: passwordRaw, category } = req.body;
    try {
        if (!companyName ||
            !companyEmail ||
            !phone ||
            !passwordRaw ||
            !companyAddress ||
            !country ||
            !state ||
            !city ||
            !category) {
            throw (0, http_errors_1.default)(400, "Parameters missing");
        }
        const existingCompanyName = yield company_1.default.findOne({ companyName });
        if (existingCompanyName) {
            throw (0, http_errors_1.default)(409, "Company already exist");
        }
        const existingCompanyEmail = yield company_1.default.findOne({ companyEmail });
        if (existingCompanyEmail) {
            throw (0, http_errors_1.default)(409, "E-mail already exist");
        }
        let slug = (0, MakeSlug_1.toSlug)(companyName);
        const checkSlug = yield company_1.default.findOne({ slug });
        if (checkSlug) {
            const id = crypto_1.default.randomUUID();
            slug = `${slug}-${id}`;
        }
        const passwordHash = yield bcryptjs_1.default.hash(passwordRaw, 10);
        const companyCode = crypto_1.default.randomUUID();
        console.log(companyCode);
        const emailBody = {
            email: companyEmail,
            name: companyName,
            subject: "Company's code for logging in",
            text: `This is the code(${companyCode}) that will be required whenever logging in to your company's account`,
        };
        const { status, message } = yield (0, mail_1.sendMail)(emailBody);
        if (status !== 201) {
            throw (0, http_errors_1.default)(status, message);
        }
        const companyCodeHash = yield bcryptjs_1.default.hash(companyCode, 10);
        const newCompany = yield company_1.default.create({
            companyName,
            companyEmail,
            phone: [phone],
            password: passwordHash,
            slug,
            companyCode: companyCodeHash,
            companyAddress,
            country,
            state,
            city,
            category,
        });
        req.session.companyId = newCompany._id;
        res.status(201).json({
            _id: newCompany._id,
            companyName: newCompany.companyName,
            companyEmail: newCompany.companyEmail,
            phone: newCompany.phone,
            slug: newCompany.slug,
            companyAddress: newCompany.companyAddress,
            country: newCompany.country,
            state: newCompany.state,
            city: newCompany.city,
            companyImage: newCompany.companyImage,
            verified: newCompany.verified,
            isCompany: newCompany.isCompany,
            category: newCompany.category
        });
    }
    catch (error) {
        next(error);
    }
});
exports.COMPANYSIGNUP = COMPANYSIGNUP;
const COMPANYSIGNIN = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyName, password, companyCode } = req.body;
    try {
        if (!companyName || !password || !companyCode) {
            throw (0, http_errors_1.default)(400, "Paremeters missing");
        }
        const existingCompany = yield company_1.default.findOne({ companyName }).select("+password +companyCode");
        if (!existingCompany) {
            throw (0, http_errors_1.default)(400, "Invalid credentials");
        }
        const matchPassword = yield bcryptjs_1.default.compare(password, existingCompany.password);
        if (!matchPassword) {
            throw (0, http_errors_1.default)(401, "Invalid credentials");
        }
        const matchCompanyCode = yield bcryptjs_1.default.compare(companyCode, existingCompany.companyCode);
        if (!matchCompanyCode) {
            throw (0, http_errors_1.default)(401, "Invalid credentials");
        }
        req.session.companyId = existingCompany._id;
        res.status(200).json({
            _id: existingCompany._id,
            companyName: existingCompany.companyName,
            companyEmail: existingCompany.companyEmail,
            phone: existingCompany.phone,
            slug: existingCompany.slug,
            companyAddress: existingCompany.companyAddress,
            country: existingCompany.country,
            state: existingCompany.state,
            city: existingCompany.city,
            companyImage: existingCompany.companyImage,
            verified: existingCompany.verified,
            isCompany: existingCompany.isCompany,
            category: existingCompany.category
        });
    }
    catch (error) {
        next(error);
    }
});
exports.COMPANYSIGNIN = COMPANYSIGNIN;
const GETAUTHCOMPANY = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.session.companyId;
        const company = yield company_1.default.findById(companyId);
        res.status(200).json(company);
    }
    catch (error) {
        next(error);
    }
});
exports.GETAUTHCOMPANY = GETAUTHCOMPANY;
const UPDATEDETAILS = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, companyName, companyEmail, phone, companyAddress, country, state, city, description, website, delivery, delivery_fee, free_delivery_amount, delivery_zip_codes, order_lead_time, category } = req.body;
        const companyDetails = yield company_1.default.findById(req.session.companyId);
        if (String(companyDetails === null || companyDetails === void 0 ? void 0 : companyDetails._id) !== String(_id)) {
            throw (0, http_errors_1.default)(400, "You cannot edit someone else's account details");
        }
        if (!companyName ||
            !companyEmail ||
            (phone === null || phone === void 0 ? void 0 : phone.length) === 0 ||
            !companyAddress ||
            !country ||
            !state ||
            !city ||
            !description ||
            typeof delivery !== "boolean" ||
            !category) {
            throw (0, http_errors_1.default)(400, "Parameters missing");
        }
        let slug;
        if (companyName !== (companyDetails === null || companyDetails === void 0 ? void 0 : companyDetails.companyName)) {
            const findNewName = yield company_1.default.findOne({ companyName });
            if (findNewName) {
                throw (0, http_errors_1.default)(400, "Company name already exist");
            }
            slug = (0, MakeSlug_1.toSlug)(companyName);
            const checkSlug = yield company_1.default.findOne({ slug });
            if (checkSlug) {
                const id = crypto_1.default.randomUUID();
                slug = `${slug}-${id}`;
            }
        }
        if (companyEmail !== (companyDetails === null || companyDetails === void 0 ? void 0 : companyDetails.companyEmail)) {
            const findNewEmail = yield company_1.default.findOne({ companyEmail });
            if (findNewEmail) {
                throw (0, http_errors_1.default)(400, "E-mail already exist");
            }
        }
        if ((delivery && !order_lead_time) || (delivery && order_lead_time === 0)) {
            throw (0, http_errors_1.default)(400, "Please fill how long it takes to get your food delivered");
        }
        if (delivery && !delivery_fee) {
            delivery_fee = 0;
        }
        const updatedDetails = yield company_1.default.findByIdAndUpdate(_id, {
            companyName,
            companyEmail,
            slug: slug || (companyDetails === null || companyDetails === void 0 ? void 0 : companyDetails.slug),
            phone,
            companyAddress,
            country,
            state,
            city,
            description,
            website,
            delivery,
            delivery_fee,
            free_delivery_amount,
            delivery_zip_codes,
            order_lead_time,
            category,
        }, { new: true });
        return res.status(200).json(updatedDetails);
    }
    catch (error) {
        next(error);
    }
});
exports.UPDATEDETAILS = UPDATEDETAILS;
const UPDATECOMPANYIMAGE = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, image } = req.body;
        const companyDetails = yield company_1.default.findById(req.session.companyId);
        if (String(companyDetails === null || companyDetails === void 0 ? void 0 : companyDetails._id) !== String(_id)) {
            throw (0, http_errors_1.default)(400, "You cannot edit someone else's account details");
        }
        if (!image) {
            throw (0, http_errors_1.default)(400, "You did not upload an image");
        }
        const photoUrl = yield cloudinary_1.v2.uploader.upload(image);
        const updatedProfile = yield company_1.default.findByIdAndUpdate(_id, {
            companyImage: photoUrl.url,
        }, { new: true });
        res.status(200).json(updatedProfile === null || updatedProfile === void 0 ? void 0 : updatedProfile.companyImage);
    }
    catch (error) {
        next(error);
    }
});
exports.UPDATECOMPANYIMAGE = UPDATECOMPANYIMAGE;
