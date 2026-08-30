import axios from "axios";

const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
const baseURL = configuredBaseUrl && !/^https?:\/\/localhost(?::\d+)?(?:\/|$)/i.test(configuredBaseUrl)
  ? configuredBaseUrl
  : "/api";

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
