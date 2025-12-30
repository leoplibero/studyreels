import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// Configuração da API (defina em EXPO_PUBLIC_API_URL no .env para evitar expor IP)
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000/api";

// Função auxiliar para tratar erros de autenticação
const handleAuthError = async (status: number) => {
  if (status === 401) {
    // Token expirado ou inválido
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userId");
    router.replace("/login");
    throw new Error("Sessão expirada. Faça login novamente.");
  }
};

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
  message?: string;
}

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    // Validar senha
    if (data.password !== data.confirmPassword) {
      throw new Error("As senhas não coincidem");
    }

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        role: "student",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erro ao registrar");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erro ao fazer login");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const getMe = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      await handleAuthError(401);
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erro ao carregar dados do usuário");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

// Videos
export interface Video {
  _id: string;
  title: string;
  description: string;
  url: string;
  teacher: {
    _id: string;
    name: string;
    email: string;
  };
  subject: string;
  likes: string[];
  createdAt: string;
}

export interface FeedResponse {
  items: Video[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getFeed = async (page = 1, limit = 10, subject = ""): Promise<FeedResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (subject) params.append("subject", subject);

    const response = await fetch(`${API_URL}/videos?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erro ao carregar feed");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const createVideo = async (data: { title: string; description: string; videoUrl: string; subject: string }, token: string) => {
  try {
    const response = await fetch(`${API_URL}/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      await handleAuthError(401);
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erro ao criar vídeo");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const likeVideo = async (videoId: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/videos/${videoId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      await handleAuthError(401);
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erro ao curtir vídeo");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

// Quiz
export interface Quiz {
  _id: string;
  video: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizAnswerResponse {
  correct: boolean;
  message: string;
}

export const getQuizForVideo = async (videoId: string): Promise<Quiz> => {
  try {
    const response = await fetch(`${API_URL}/quizzes/video/${videoId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erro ao carregar quiz");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const answerQuiz = async (quizId: string, answer: string, token: string): Promise<QuizAnswerResponse> => {
  try {
    const response = await fetch(`${API_URL}/quizzes/${quizId}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ answer }),
    });

    if (response.status === 401) {
      await handleAuthError(401);
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erro ao responder quiz");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

// Ranking
export interface RankingUser {
  _id: string;
  name: string;
  xp: number;
  level: number;
}

export interface RankingResponse {
  users: RankingUser[];
}

export const getRanking = async (): Promise<RankingResponse> => {
  try {
    const response = await fetch(`${API_URL}/ranking`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erro ao carregar ranking");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};
