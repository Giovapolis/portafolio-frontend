import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
  order: number;
}

export async function getSkills(): Promise<Skill[]> {
  const response = await axios.get<Skill[]>(`${API_URL}/skills`);
  return response.data;
}

export async function createSkill(token: string, data: Omit<Skill, "id">) {
  const response = await axios.post<Skill>(`${API_URL}/skills`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function updateSkill(
  token: string,
  skillId: number,
  data: Partial<Skill>,
) {
  const response = await axios.put<Skill>(
    `${API_URL}/skills/${skillId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export async function deleteSkill(token: string, skillId: number) {
  await axios.delete(`${API_URL}/skills/${skillId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
