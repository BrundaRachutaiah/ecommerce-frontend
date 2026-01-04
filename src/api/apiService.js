// src/api/apiService.js
import axios from "axios";

const isDev = import.meta.env.DEV;

const baseURL = isDev
  ? "/api"
  : "https://backend-e-commerce-beta.vercel.app/api";

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((config) => {
  // session id (guest cart)
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = "session_" + Date.now();
    localStorage.setItem("sessionId", sessionId);
  }
  config.headers["x-session-id"] = sessionId;

  // 🔥 AUTH TOKEN (FIXES ADDRESS + CHECKOUT)
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;