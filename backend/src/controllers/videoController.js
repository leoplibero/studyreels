import { getFeed, createVideo, toggleLike } from "../services/videoService.js";

export async function getFeedController(req, res) {
  try {
    const { page, limit, subject } = req.query;
    const data = await getFeed({ page, limit, subject });
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

export async function likeVideoController(req, res) {
  try {
    const { id } = req.params;
    const result = await toggleLike(id, req.user.id);
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
}
