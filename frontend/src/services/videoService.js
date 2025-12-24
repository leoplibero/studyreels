import api from "./api";

export async function fetchVideos(params = {}) {
  const res = await api.get("/videos", { params });
  return res.data;
}

export async function likeVideo(id) {
  const res = await api.post(`/videos/${id}/like`);
  return res.data;
}
