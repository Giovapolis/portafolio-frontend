import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Course {
  id: number;
  title: string;
  platform: string;
  certificate_url?: string;
  date?: string;
}

export async function getCourses(): Promise<Course[]> {
  const response = await axios.get<Course[]>(`${API_URL}/courses`);
  return response.data;
}

export async function createCourse(token: string, data: Omit<Course, "id">) {
  const response = await axios.post<Course>(`${API_URL}/courses`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function updateCourse(token: string, courseId: number, data: Partial<Course>) {
  const response = await axios.put<Course>(`${API_URL}/courses/${courseId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deleteCourse(token: string, courseId: number) {
  await axios.delete(`${API_URL}/courses/${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
