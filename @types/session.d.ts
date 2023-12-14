import mongoose, { Mongoose } from "mongoose";

declare module "express-session" {
    interface SessionData {
        userId: mongoose.types.objectId,
        companyId: mongoose.types.objectId
    }
}