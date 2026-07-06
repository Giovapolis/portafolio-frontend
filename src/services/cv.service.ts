import axios from "axios";
import { Education } from "@/types/education";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// EDUCATION
export async function getEducation(): Promise<Education[]> {
  const response = await axios.get(`${API_URL}/education/`);
  return response.data;
}

export async function createEducation(
  token: string,
  data: Partial<Education>,
) {
  const response = await axios.post(`${API_URL}/education/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateEducation(
  token: string,
  educationId: number,
  data: Partial<Education>,
) {
  const response = await axios.put(
    `${API_URL}/education/${educationId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

export async function deleteEducation(token: string, educationId: number) {
  await axios.delete(`${API_URL}/education/${educationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// CV PDF
export async function downloadCVPDF(token?: string): Promise<Blob> {
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await axios.get(`${API_URL}/cv/pdf`, {
    responseType: "blob",
    headers,
  });
  return response.data;
}

export function savePDFToFile(blob: Blob, filename: string = "cv.pdf") {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
