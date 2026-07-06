import axios from "axios";
import { Profile } from "@/types/profile";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getProfile(): Promise<Profile | null> {
  const response = await axios.get<Profile>(`${API_URL}/profile/`);
  return response.data;
}

export async function updateProfile(
  token: string,
  data: Partial<Profile>,
) {
  const response = await axios.put<Profile>(`${API_URL}/profile/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
