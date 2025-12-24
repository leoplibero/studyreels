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
  const teacher = await User.findById(teacherId);
  if (!teacher || teacher.role !== "teacher") {
    throw new Error("Apenas professores podem publicar vídeos");
  }

  const video = await Video.create({ ...payload, teacher: teacherId });
  return video;
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
