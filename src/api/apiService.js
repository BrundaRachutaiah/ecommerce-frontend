// src/apiService.js
import axios from "axios";

// Use different base URLs for development and production
const isDev = import.meta.env.DEV;
const baseURL = isDev 
  ? '/api' // Use proxy in development
  : 'https://backend-e-commerce-beta.vercel.app/api'; // Use direct URL in production

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((config) => {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = "session_" + Date.now();
    localStorage.setItem("sessionId", sessionId);
  }
  config.headers["x-session-id"] = sessionId;
  return config;
});

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    // Check if response is HTML (indicates routing issue)
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      throw new Error("API request was routed to frontend instead of backend");
    }
    return response;
  },
  (error) => {
    // Check if error response is HTML
    if (error.response && typeof error.response.data === 'string' && 
        error.response.data.includes('<!doctype html>')) {
      throw new Error("API request was routed to frontend instead of backend");
    }
    
    const message = error.response?.data?.message || "An error occurred";
    return Promise.reject(error);
  }
);

export default API;