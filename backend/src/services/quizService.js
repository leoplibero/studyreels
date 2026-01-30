import Quiz from "../models/Quiz.js";
import QuizResult from "../models/QuizResult.js";
import User from "../models/User.js";

export async function createQuiz(payload) {
  const { video, question, options, correctAnswer, xpReward } = payload;
  
  if (!video || !question || !options || options.length !== 4 || correctAnswer === undefined) {
    throw new Error("Campos obrigatórios: video, question, options (4 items), correctAnswer");
  }

  if (Number(correctAnswer) < 0 || Number(correctAnswer) > 3) {
    throw new Error("correctAnswer deve ser entre 0 e 3");
  }

  const quiz = await Quiz.create({
    video,
    question,
    options,
    correctAnswer: Number(correctAnswer),
    xpReward: xpReward || 50
  });

  return quiz;
}

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
  return Math.max(1, Math.floor(Number(xp) / 200) + 1);
}
