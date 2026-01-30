import Video from "../models/Video.js";
import User from "../models/User.js";

export async function getFeed({ page = 1, limit = 10, subject }) {
  const query = subject ? { subject } : {};
  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Video.find(query)
      .populate("teacher", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Video.countDocuments(query)
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit) || 1)
    }
  };
}

export async function createVideo(teacherId, payload) {
  const Quiz = (await import("../models/Quiz.js")).default;
  
  const teacher = await User.findById(teacherId);
  if (!teacher || (teacher.role !== "teacher" && teacher.role !== "admin")) {
    throw new Error("Apenas professores podem publicar vídeos");
  }

  const { quiz, ...videoData } = payload;

  const video = await Video.create({ ...videoData, teacher: teacher._id });

  if (quiz) {
    if (!quiz.question || !quiz.options || quiz.options.length !== 4 || quiz.correctAnswer === undefined) {
      throw new Error("Quiz inválido: question, options (4 items) e correctAnswer são obrigatórios");
    }

    await Quiz.create({
      video: video._id,
      question: quiz.question,
      options: quiz.options,
      correctAnswer: Number(quiz.correctAnswer),
      xpReward: quiz.xpReward || 50
    });
  }

  return video;
}

export async function getFeedWithQuiz({ page = 1, limit = 5, subject }) {
  const Quiz = (await import("../models/Quiz.js")).default;
  const query = subject ? { subject } : {};
  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Video.find(query)
      .populate("teacher", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Video.countDocuments(query)
  ]);

  // Buscar quiz para cada vídeo
  const itemsWithQuiz = await Promise.all(
    items.map(async (video) => {
      const quiz = await Quiz.findOne({ video: video._id });
      return {
        ...video.toObject(),
        quiz: quiz || null
      };
    })
  );

  return {
    items: itemsWithQuiz,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit) || 1)
    }
  };
}

export async function toggleLike(videoId, userId) {
  const video = await Video.findById(videoId);
  if (!video) throw new Error("Vídeo não encontrado");

  const liked = video.likes.some((u) => String(u) === String(userId));
  if (liked) {
    video.likes = video.likes.filter((u) => String(u) !== String(userId));
  } else {
    video.likes.push(userId);
  }
  await video.save();
  return { liked: !liked, likesCount: video.likes.length };
}
