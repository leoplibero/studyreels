import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    // Índice da alternativa correta (0-based)
    correctAnswer: { type: Number, required: true },
    xpReward: { type: Number, default: 10 }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export default mongoose.model("Quiz", quizSchema);
