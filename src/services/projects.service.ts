import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Project {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  repo_url?: string;
  demo_url: string;
  featured: boolean;
  order: number;
}

export async function getProjects(): Promise<Project[]> {
  const response = await axios.get<Project[]>(`${API_URL}/projects`);
  return response.data;
}

export async function getProject(projectId: number): Promise<Project> {
  const response = await axios.get<Project>(`${API_URL}/projects/${projectId}`);
  return response.data;
}

export async function createProject(token: string, data: Omit<Project, "id">) {
  const response = await axios.post<Project>(`${API_URL}/projects`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function updateProject(
  token: string,
  projectId: number,
  data: Partial<Project>,
) {
  const response = await axios.put<Project>(
    `${API_URL}/projects/${projectId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export async function deleteProject(token: string, projectId: number) {
  await axios.delete(`${API_URL}/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
