import { Router } from "express";
import * as userVendorController from "../controllers/userVendor";

const router = Router();

router.get("/vendors", userVendorController.getCompanies);
router.get("/vendor/:slug", userVendorController.getCompany);

export default router;
