import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const createSafepayTracker = (token, data) =>
  API.post("/safepay/create-tracker", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
