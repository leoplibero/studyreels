import Quiz from "../models/Quiz.js";
import QuizResult from "../models/QuizResult.js";
import User from "../models/User.js";

export async function getQuizByVideo(videoId) {
  const quiz = await Quiz.findOne({ video: videoId });
  if (!quiz) throw new Error("Quiz não encontrado para este vídeo");
  return quiz;
}

export async function answerQuiz({ quizId, userId, answerIndex }) {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("Quiz não encontrado");

  const isCorrect = Number(answerIndex) === Number(quiz.correctAnswer);
  let xpEarned = 0;

  if (isCorrect) {
    xpEarned = Number(quiz.xpReward || 0);
    const user = await User.findById(userId);
    if (!user) throw new Error("Usuário não encontrado");
    user.xp = Number(user.xp || 0) + xpEarned;
    user.level = calculateLevel(user.xp);
    await user.save();
  }

  const result = await QuizResult.create({ user: userId, quiz: quizId, isCorrect, xpEarned });

  return { isCorrect, xpEarned, resultId: result._id };
}

function calculateLevel(xp) {
  // A cada 200 XP sobe 1 nível (equivalente a 4 quizzes acertados)
  // Nível mínimo 1
  return Math.max(1, Math.floor(Number(xp) / 200) + 1);
}
