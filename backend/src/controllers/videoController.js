import { getFeed, getFeedWithQuiz, createVideo } from "../services/videoService.js";

export async function getFeedController(req, res) {
  try {
    const { page, limit, subject, withQuiz } = req.query;
    const data = withQuiz === "true" 
      ? await getFeedWithQuiz({ page, limit, subject })
      : await getFeed({ page, limit, subject });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createVideoController(req, res) {
  try {
    const payload = req.body;
    const video = await createVideo(req.user.id, payload);
    return res.status(201).json({ success: true, data: video });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}