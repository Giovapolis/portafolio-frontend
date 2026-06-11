import axios from "axios";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.detail) {
      if (Array.isArray(error.response.data.detail)) {
        return error.response.data.detail
          .map((e: { msg: string }) => e.msg)
          .join(", ");
      }
      return error.response.data.detail;
    }
    return "Request failed";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}
