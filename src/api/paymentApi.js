import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

/* ---------------------- USER WALLET APIs ---------------------- */

// Deposit request
export const depositRequest = (token, data) =>
  API.post("/wallet/deposit", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Withdraw request
export const withdrawRequest = (token, data) =>
  API.post("/wallet/withdraw", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Transfer funds between wallets
export const transferFunds = (token, data) =>
  API.post("/wallet/transfer", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Get all my wallet transactions
export const getMyTransactions = (token, params = {}) =>
  API.get("/wallet/my-transactions", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

/* ---------------------- ADMIN WALLET APIs ---------------------- */

// Approve deposit
export const approveDeposit = (token, transactionId, amount) =>
  API.post(
    "/wallet/deposit/approve",
    amount !== undefined ? { transactionId, amount } : { transactionId },
    { headers: { Authorization: `Bearer ${token}` } },
  );
// Reject deposit
export const rejectDeposit = (token, transactionId) =>
  API.post(
    "/wallet/deposit/reject",
    { transactionId },
    { headers: { Authorization: `Bearer ${token}` } },
  );

// Approve withdraw
export const approveWithdraw = (token, transactionId) =>
  API.post(
    "/wallet/withdraw/approve",
    { transactionId },
    { headers: { Authorization: `Bearer ${token}` } },
  );

// Reject withdraw
export const rejectWithdraw = (token, transactionId) =>
  API.post(
    "/wallet/withdraw/reject",
    { transactionId },
    { headers: { Authorization: `Bearer ${token}` } },
  );

// Get all transactions (admin view)
export const getAllTransactions = async (token, status, type) => {
  const res = await API.get("/wallet/transactions", {
    headers: { Authorization: `Bearer ${token}` },
    params: { status, type },
  });
  return res.data; // ✅ ensures we get { success, transactions }
};

// Get pending transactions (admin view)
export const getPendingTransactions = (token, type) =>
  API.get("/wallet/transactions", {
    headers: { Authorization: `Bearer ${token}` },
    params: { status: "pending", type },
  });

// Delete transaction
export const deleteTransaction = (token, transactionId) =>
  API.delete(`/wallet/transactions/${transactionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const releaseBuyerEscrow = (token, transactionId) =>
  API.post(
    "/wallet/release-buyer-escrow",
    { transactionId },
    { headers: { Authorization: `Bearer ${token}` } },
  );
