import { Router } from "express";
import { getQuizForVideoController, answerQuizController } from "../controllers/quizController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

// Quiz por vídeo
router.get("/video/:id", getQuizForVideoController);
// Responder quiz
router.post("/:id/answer", requireAuth, answerQuizController);

export default router;
