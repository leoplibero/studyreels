import { getRanking } from "../services/rankingService.js";

export async function getRankingController(req, res) {
  try {
    const { limit } = req.query;
    const data = await getRanking(limit || 20);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
