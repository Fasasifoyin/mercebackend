import { InferSchemaType, Schema, model } from "mongoose";

const companySchema = new Schema(
  {
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
      default:
        "https://res.cloudinary.com/dbxvk3apv/image/upload/v1701159540/Food/Popular-Nigerian-Food_rjz3dp.webp",
    },
  },
  { timestamps: true }
);

type Company = InferSchemaType<typeof companySchema>;

export default model<Company>("Company", companySchema);
