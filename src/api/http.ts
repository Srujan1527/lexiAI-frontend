import axios from "axios";

/**
 * Backend uses httpOnly cookie auth (access_token).
 * So we must send requests with credentials.
 */
export const http = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
});
