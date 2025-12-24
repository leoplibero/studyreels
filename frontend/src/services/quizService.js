import api from "./api";

export async function fetchQuizByVideo(videoId) {
  const res = await api.get(`/quizzes/video/${videoId}`);
  return res.data;
}

export async function answerQuiz(quizId, answerIndex) {
  const res = await api.post(`/quizzes/${quizId}/answer`, { answerIndex });
  return res.data;
}
