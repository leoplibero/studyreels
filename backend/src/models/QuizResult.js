import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    isCorrect: { type: Boolean, required: true },
    xpEarned: { type: Number, default: 0 },
    answeredAt: { type: Date, default: Date.now }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export default mongoose.model("QuizResult", quizResultSchema);
