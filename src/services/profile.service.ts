import axios from "axios";
import { Profile } from "@/types/profile";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getMyProfiles(token: string): Promise<Profile[]> {
  const response = await axios.get<Profile[]>(`${API_URL}/profiles/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getProfile(
  token: string,
  profileId: number,
): Promise<Profile | null> {
  const response = await axios.get<Profile>(`${API_URL}/profiles/${profileId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

// Public version (no auth required)
export async function getProfilePublic(
  profileId: number,
): Promise<Profile | null> {
  const response = await axios.get<Profile>(`${API_URL}/profiles/${profileId}`);
  return response.data;
}

export async function getUserProfiles(userId: number): Promise<Profile[]> {
  const response = await axios.get<Profile[]>(`${API_URL}/profiles/user/${userId}`);
  return response.data;
}

export async function createProfile(token: string, data: Partial<Profile>) {
  const response = await axios.post<Profile>(`${API_URL}/profiles`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function updateProfile(
  token: string,
  profileId: number,
  data: Partial<Profile>,
) {
  const response = await axios.put<Profile>(`${API_URL}/profiles/${profileId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deleteProfile(token: string, profileId: number) {
  await axios.delete(`${API_URL}/profiles/${profileId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
