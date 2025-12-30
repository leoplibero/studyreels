import { getRanking } from "../services/rankingService.js";

export async function getRankingController(req, res) {
  try {
    const { limit } = req.query;
    const users = await getRanking(limit || 100);
    return res.json({ success: true, data: { users } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
