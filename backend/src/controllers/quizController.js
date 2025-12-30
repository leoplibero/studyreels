import { getQuizByVideo, answerQuiz } from "../services/quizService.js";

export async function getQuizForVideoController(req, res) {
  try {
    const { id } = req.params;
    const quiz = await getQuizByVideo(id);
    const safe = { id: quiz._id, question: quiz.question, options: quiz.options, xpReward: quiz.xpReward };
    return res.json({ success: true, data: safe });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
}

export async function answerQuizController(req, res) {
  try {
    const { id } = req.params; // quiz id
    const { answerIndex } = req.body;
    const result = await answerQuiz({ quizId: id, userId: req.user.id, answerIndex });
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}
