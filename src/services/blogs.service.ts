import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content_md: string;
  excerpt?: string;
  tags?: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export async function getBlogs(): Promise<Blog[]> {
  const response = await axios.get<Blog[]>(`${API_URL}/blog`);
  return response.data;
}

export async function getBlog(slug: string): Promise<Blog> {
  const response = await axios.get<Blog>(`${API_URL}/blog/${slug}`);
  return response.data;
}

export async function createBlog(
  token: string,
  data: Omit<Blog, "id" | "created_at" | "updated_at">,
) {
  const response = await axios.post<Blog>(`${API_URL}/blog`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function updateBlog(
  token: string,
  postId: number,
  data: Partial<Omit<Blog, "id" | "created_at" | "updated_at">>,
) {
  const response = await axios.put<Blog>(`${API_URL}/blog/${postId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deleteBlog(token: string, postId: number) {
  await axios.delete(`${API_URL}/blog/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
