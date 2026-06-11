import axios from "axios";
import { Experience } from "@/types/experience";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getExperience(): Promise<Experience[]> {
  const response = await axios.get<Experience[]>(`${API_URL}/experience`);
  return response.data;
}

export async function createExperience(token: string, data: Partial<Experience>) {
  const response = await axios.post<Experience>(`${API_URL}/experience`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function updateExperience(
  token: string,
  expId: number,
  data: Partial<Experience>,
) {
  const response = await axios.put<Experience>(`${API_URL}/experience/${expId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deleteExperience(token: string, expId: number) {
  await axios.delete(`${API_URL}/experience/${expId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
