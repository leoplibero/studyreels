import { Router } from "express";
import { getFeedController, createVideoController, likeVideoController } from "../controllers/videoController.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getFeedController);
router.post("/", requireAuth, requireRole("teacher"), createVideoController);
router.post("/:id/like", requireAuth, likeVideoController);

export default router;
