/* ---------------------- PURCHASE APIs ---------------------- */
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});
export const buyProduct = (token, data) =>
  API.post("/purchases/buy", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// User fetch own purchases
export const getMyPurchases = (token, params = {}) =>
  API.get("/purchases/my", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

// Admin fetch all purchases
export const getAllPurchases = (token, search = "") =>
  API.get(`/purchases/all${search ? `?search=${search}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const claimProfit = (token, purchaseId) =>
  API.post(
    "/purchases/claim-profit",
    { purchaseId },
    { headers: { Authorization: `Bearer ${token}` } },
  );

export const deletePurchase = (token, id) =>
  API.delete(`/purchases/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
