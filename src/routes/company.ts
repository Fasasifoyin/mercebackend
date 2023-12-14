import { Router } from "express";
import * as companyController from "../controllers/company";
import { Auth } from "../middleware/companyAuth";

const router = Router();

router.post("/signup", companyController.COMPANYSIGNUP);
router.post("/signin", companyController.COMPANYSIGNIN);

router.get("/auth", Auth, companyController.GETAUTHCOMPANY);
router.patch("/profile/update", Auth, companyController.UPDATEDETAILS);
router.patch(
  "/profile/update/image",
  Auth,
  companyController.UPDATECOMPANYIMAGE
);

export default router;
