import { Router } from "express";
import * as userController from "../controllers/user";

const router = Router();

// router.get("/", userController.getAuthenticatedUser);

router.post("/signup", userController.SIGNUP);
router.post("/signin", userController.SIGNIN);

export default router;
