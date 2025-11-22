// src/config/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "https://chat-buddies-y1jm.onrender.com/api", // Adjust if your port differs
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("userInfo")) {
    const token = JSON.parse(localStorage.getItem("userInfo") || "{}").token;
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;