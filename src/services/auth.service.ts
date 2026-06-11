import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await axios.post<LoginResponse>(`${API_URL}/users/login`, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export async function register(data: RegisterData): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(`${API_URL}/users/register`, data);
  return response.data;
}
