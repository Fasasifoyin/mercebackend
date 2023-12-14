import { RequestHandler } from "express";
import Company from "../models/company";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendMail } from "../mail/mail";
import { toSlug } from "../utils/MakeSlug";
import { v2 as cloudinary } from "cloudinary";
import ENV from "../utils/validateEnv";

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

type SIGNUPBODY = {
  companyName?: string;
  companyEmail?: string;
  phone?: number;
  password?: string;
  companyAddress?: string;
  country?: string;
  state?: string;
  city?: string;
  category?: string;
};

export const COMPANYSIGNUP: RequestHandler<
  unknown,
  unknown,
  SIGNUPBODY,
  unknown
> = async (req, res, next) => {
  const {
    companyName,
    companyEmail,
    phone,
    country,
    state,
    city,
    companyAddress,
    password: passwordRaw,
    category
  } = req.body;
  try {
    if (
      !companyName ||
      !companyEmail ||
      !phone ||
      !passwordRaw ||
      !companyAddress ||
      !country ||
      !state ||
      !city ||
      !category
    ) {
      throw createHttpError(400, "Parameters missing");
    }

    const existingCompanyName = await Company.findOne({ companyName });
    if (existingCompanyName) {
      throw createHttpError(409, "Company already exist");
    }

    const existingCompanyEmail = await Company.findOne({ companyEmail });
    if (existingCompanyEmail) {
      throw createHttpError(409, "E-mail already exist");
    }

    let slug = toSlug(companyName);
    const checkSlug = await Company.findOne({ slug });
    if (checkSlug) {
      const id = crypto.randomUUID();
      slug = `${slug}-${id}`;
    }

    const passwordHash = await bcrypt.hash(passwordRaw, 10);
    const companyCode = crypto.randomUUID();
    console.log(companyCode)

    const emailBody = {
      email: companyEmail,
      name: companyName,
      subject: "Company's code for logging in",
      text: `This is the code(${companyCode}) that will be required whenever logging in to your company's account`,
    };

    const { status, message } = await sendMail(emailBody);
    if (status !== 201) {
      throw createHttpError(status, message);
    }

    const companyCodeHash = await bcrypt.hash(companyCode, 10);

    const newCompany = await Company.create({
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
  } catch (error) {
    next(error);
  }
};

type SIGNINBODY = {
  companyName?: string;
  password?: string;
  companyCode?: string;
};

export const COMPANYSIGNIN: RequestHandler<
  unknown,
  unknown,
  SIGNINBODY,
  unknown
> = async (req, res, next) => {
  const { companyName, password, companyCode } = req.body;
  try {
    if (!companyName || !password || !companyCode) {
      throw createHttpError(400, "Paremeters missing");
    }

    const existingCompany = await Company.findOne({ companyName }).select(
      "+password +companyCode"
    );
    if (!existingCompany) {
      throw createHttpError(400, "Invalid credentials");
    }

    const matchPassword = await bcrypt.compare(
      password,
      existingCompany.password
    );
    if (!matchPassword) {
      throw createHttpError(401, "Invalid credentials");
    }

    const matchCompanyCode = await bcrypt.compare(
      companyCode,
      existingCompany.companyCode
    );
    if (!matchCompanyCode) {
      throw createHttpError(401, "Invalid credentials");
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
  } catch (error) {
    next(error);
  }
};

export const GETAUTHCOMPANY: RequestHandler = async (req, res, next) => {
  try {
    const companyId = req.session.companyId;
    const company = await Company.findById(companyId);
    res.status(200).json(company);
  } catch (error) {
    next(error);
  }
};

type UPDATEBODY = {
  _id?: string;
  companyName?: string;
  companyEmail?: string;
  phone?: number[];
  companyAddress?: string;
  country?: string;
  state?: string;
  city?: string;
  description?: string;
  website?: string;
  delivery?: boolean;
  delivery_fee?: number;
  free_delivery_amount?: number;
  delivery_zip_codes?: number[];
  order_lead_time?: number;
  category?: string;
};

export const UPDATEDETAILS: RequestHandler<
  unknown,
  unknown,
  UPDATEBODY,
  unknown
> = async (req, res, next) => {
  try {
    let {
      _id,
      companyName,
      companyEmail,
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
      category
    } = req.body;

    const companyDetails = await Company.findById(req.session.companyId);
    if (String(companyDetails?._id) !== String(_id)) {
      throw createHttpError(
        400,
        "You cannot edit someone else's account details"
      );
    }

    if (
      !companyName ||
      !companyEmail ||
      phone?.length === 0 ||
      !companyAddress ||
      !country ||
      !state ||
      !city ||
      !description ||
      typeof delivery !== "boolean" ||
      !category
    ) {
      throw createHttpError(400, "Parameters missing");
    }

    let slug;
    if (companyName !== companyDetails?.companyName) {
      const findNewName = await Company.findOne({ companyName });
      if (findNewName) {
        throw createHttpError(400, "Company name already exist");
      }
      slug = toSlug(companyName);
      const checkSlug = await Company.findOne({ slug });
      if (checkSlug) {
        const id = crypto.randomUUID();
        slug = `${slug}-${id}`;
      }
    }

    if (companyEmail !== companyDetails?.companyEmail) {
      const findNewEmail = await Company.findOne({ companyEmail });
      if (findNewEmail) {
        throw createHttpError(400, "E-mail already exist");
      }
    }

    if ((delivery && !order_lead_time) || (delivery && order_lead_time === 0)) {
      throw createHttpError(
        400,
        "Please fill how long it takes to get your food delivered"
      );
    }

    if (delivery && !delivery_fee) {
      delivery_fee = 0;
    }

    const updatedDetails = await Company.findByIdAndUpdate(
      _id,
      {
        companyName,
        companyEmail,
        slug: slug || companyDetails?.slug,
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
      },
      { new: true }
    );

    return res.status(200).json(updatedDetails);
  } catch (error) {
    next(error);
  }
};

type UPDATEIMAGE = {
  _id?: string;
  image?: string;
};

export const UPDATECOMPANYIMAGE: RequestHandler<
  unknown,
  unknown,
  UPDATEIMAGE,
  unknown
> = async (req, res, next) => {
  try {
    const { _id, image } = req.body;

    const companyDetails = await Company.findById(req.session.companyId);
    if (String(companyDetails?._id) !== String(_id)) {
      throw createHttpError(
        400,
        "You cannot edit someone else's account details"
      );
    }

    if (!image) {
      throw createHttpError(400, "You did not upload an image");
    }

    const photoUrl = await cloudinary.uploader.upload(image);
    const updatedProfile = await Company.findByIdAndUpdate(
      _id,
      {
        companyImage: photoUrl.url,
      },
      { new: true }
    );
    res.status(200).json(updatedProfile?.companyImage);
  } catch (error) {
    next(error);
  }
};
