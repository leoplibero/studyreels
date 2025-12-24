import api from "./api";

export async function fetchRanking(limit = 20) {
  const res = await api.get("/ranking", { params: { limit } });
  return res.data;
}
