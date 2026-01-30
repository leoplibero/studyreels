import { Router } from "express";
import { createQuizController, getQuizForVideoController, answerQuizController } from "../controllers/quizController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

// Criar quiz (apenas professor)
router.post("/", requireAuth, createQuizController);
// Quiz por vídeo
router.get("/video/:id", getQuizForVideoController);
// Responder quiz
router.post("/:id/answer", requireAuth, answerQuizController);

export default router;
