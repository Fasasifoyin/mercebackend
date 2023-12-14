import { Router } from "express";
import * as generalController from "../controllers/general";
import { Auth } from "../middleware/auth";

const router = Router();

router.post("/logout", generalController.LOGOUT);
router.get("/loggedIn", Auth, generalController.isLoggedIn);

export default router;
