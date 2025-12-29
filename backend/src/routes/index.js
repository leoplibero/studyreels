import { Router } from "express";
import authRoutes from "./authRoutes.js";
import videoRoutes from "./videoRoutes.js";
import quizRoutes from "./quizRoutes.js";
import rankingRoutes from "./rankingRoutes.js";

const router = Router();

router.use ("/ping", (req, res) => res.send("pong"));

router.use("/auth", authRoutes);
router.use("/videos", videoRoutes);
router.use("/quizzes", quizRoutes);
router.use("/ranking", rankingRoutes);

export default router;
