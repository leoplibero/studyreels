import { Router } from "express";
import { registerController, loginController, getMeController } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", requireAuth, getMeController);

export default router;
