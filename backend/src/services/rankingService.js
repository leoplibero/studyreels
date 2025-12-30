import User from "../models/User.js";

export async function getRanking(limit = 100) {
  const users = await User.find({}).sort({ xp: -1, createdAt: 1 }).limit(Number(limit));
  
  const ranking = users.map((u, idx) => ({
    position: idx + 1,
    _id: u._id.toString(),
    name: u.name,
    xp: u.xp,
    level: u.level
  }));
  
  return ranking;
}
