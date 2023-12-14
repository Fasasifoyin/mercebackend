import { RequestHandler } from "express";
import Company from "../models/company";
import createHttpError from "http-errors";

type getCompaniesProps = {
  page?: string;
};

export const getCompanies: RequestHandler<
  unknown,
  unknown,
  unknown,
  getCompaniesProps
> = async (req, res, next) => {
  try {
    const { page } = req.query;
    if (!page) {
      throw createHttpError(400, "A pagination number was not sent via query");
    }

    const LIMIT = 10;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await Company.countDocuments({});

    const companies = await Company.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res
      .status(200)
      .json({ data: companies, totalPages: Math.ceil(total / LIMIT) });
  } catch (error) {
    next(error);
  }
};

type getCompanyProp = {
  slug?: string;
};

export const getCompany: RequestHandler<
  getCompanyProp,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      throw createHttpError("400", "Parameter missing");
    }

    const company = await Company.findOne({ slug });
    if (!company) {
      throw createHttpError("400", "Vendor does not exist");
    }

    res.status(200).json(company);
  } catch (error) {
    next(error);
  }
};
