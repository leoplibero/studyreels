// Configuração da API
const API_URL = "http://localhost:4000/api";

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
