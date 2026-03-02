import axios from "axios";

const API = axios.create({
  baseURL:
    `${import.meta.env.VITE_API_URL}/deposit` ||
    "http://localhost:5000/api/deposit",
});

// 🪙 1. Initialize a deposit (generate address)
export const initDeposit = (data) => API.post("/init", data);

// 📡 2. Check deposit status
export const getDepositStatus = (orderId) =>
  API.get(`/status?orderId=${orderId}`);
