import { Router } from "express";
import { getFeedController, createVideoController } from "../controllers/videoController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getFeedController);
router.post("/", requireAuth, createVideoController);

export default router;
