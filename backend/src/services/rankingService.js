import User from "../models/User.js";

export async function getRanking(limit = 20) {
  const top = await User.find({}).sort({ xp: -1, createdAt: 1 }).limit(Number(limit));
  return top.map((u, idx) => ({
    position: idx + 1,
    id: u._id,
    name: u.name,
    xp: u.xp,
    level: u.level
  }));
}
