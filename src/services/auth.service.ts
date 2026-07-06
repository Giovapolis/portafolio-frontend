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

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await axios.post<LoginResponse>(
    `${API_URL}/auth/login`,
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data;
}
