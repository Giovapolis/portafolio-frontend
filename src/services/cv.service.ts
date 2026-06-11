import axios from "axios";
import { Experience } from "@/types/experience";
import { Education } from "@/types/education";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// EDUCATION ENDPOINTS
export async function getEducation(
  token: string,
  profileId: number,
): Promise<Education[]> {
  const response = await axios.get(`${API_URL}/education/`, {
    params: { profile_id: profileId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Public versions (no auth)
export async function getEducationPublic(
  profileId: number,
): Promise<Education[]> {
  const response = await axios.get(`${API_URL}/education/`, {
    params: { profile_id: profileId },
  });
  return response.data;
}

export async function createEducation(
  token: string,
  profileId: number,
  data: Partial<Education>,
) {
  const response = await axios.post(
    `${API_URL}/education/`,
    { ...data, profile_id: profileId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

export async function updateEducation(
  token: string,
  profileId: number,
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

export async function deleteEducation(
  token: string,
  profileId: number,
  educationId: number,
) {
  await axios.delete(`${API_URL}/education/${educationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// EXPERIENCE ENDPOINTS
export async function getExperiences(
  token: string,
  profileId: number,
  limit: number = 10,
  offset: number = 0,
): Promise<Experience[]> {
  const response = await axios.get(`${API_URL}/experience/`, {
    params: { limit, offset, profile_id: profileId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getExperiencesPublic(
  profileId: number,
  limit: number = 10,
  offset: number = 0,
): Promise<Experience[]> {
  const response = await axios.get(`${API_URL}/experience/`, {
    params: { limit, offset, profile_id: profileId },
  });
  return response.data;
}

export async function createExperience(
  token: string,
  profileId: number,
  data: Partial<Experience>,
) {
  const response = await axios.post(`${API_URL}/experience/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateExperience(
  token: string,
  profileId: number,
  experienceId: number,
  data: Partial<Experience>,
) {
  const response = await axios.put(
    `${API_URL}/experience/${experienceId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

export async function deleteExperience(
  token: string,
  profileId: number,
  experienceId: number,
) {
  await axios.delete(`${API_URL}/experience/${experienceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// CV PDF ENDPOINT
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
