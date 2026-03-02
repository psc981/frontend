"use client";

import { useContext, useState } from "react";
import { toast } from "react-toastify";
import {
  FaTimes,
  FaMoneyBillWave,
  FaCheckCircle,
  FaChevronDown,
  FaExchangeAlt,
} from "react-icons/fa";
import { SiTether, SiVisa, SiMastercard } from "react-icons/si";
import { AuthContext } from "../context/AuthContext";
import { withdrawRequest, transferFunds } from "../api/paymentApi";

export default function WithdrawModal({
  isOpen,
  onClose,
  onSuccess,
  withdrawableBalance,
  isRestricted,
}) {
  const { token, user } = useContext(AuthContext);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showSwap, setShowSwap] = useState(false);
  const [swapAmount, setSwapAmount] = useState("");
  const [swapDirection, setSwapDirection] = useState("AtoB"); // AtoB: Available -> Withdrawal, BtoA: Withdrawal -> Available
  const [form, setForm] = useState({
    withdrawalAddress: "",
    amount: "",
    method: "",
  });
  const [loading, setLoading] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);

  const rechargeBalance = Math.max(
    0,
    (user?.balance || 0) - (withdrawableBalance || 0),
  );

  const fee = form.amount
    ? Math.round(Number(form.amount) * 0.038 * 100) / 100
    : 0;
  const netAmount = form.amount
    ? Math.round((Number(form.amount) - fee) * 100) / 100
    : 0;
  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWithdraw = async () => {
    const { withdrawalAddress, amount, method } = form;

    if (!withdrawalAddress || !amount || !method) {
      toast.warning("Please fill in all fields before submitting.");
      return;
    }

    if (Number(amount) <= 0) {
      toast.warning("Please enter a valid amount");
      return;
    }

    if (Number(amount) < 30) {
      toast.warning("Minimum withdrawal amount is 30 USDT");
      return;
    }

    const maxAvailable = withdrawableBalance;
    if (Number(amount) > maxAvailable) {
      toast.error(
        "Insufficient withdrawal balance. You can only withdraw from withdrawable balance",
      );
      return;
    }

    try {
      setLoading(true);
      await withdrawRequest(token, {
        amount: Number(amount),
        method,
        accountName: "Crypto Wallet",
        accountNumber: withdrawalAddress,
      });
      toast.success("Withdrawal request submitted successfully");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message || "Failed to submit withdrawal request";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!swapAmount || Number(swapAmount) <= 0) {
      toast.warning("Please enter a valid amount");
      return;
    }

    if (swapDirection === "AtoB") {
      // Direction A -> B: Show the special popup message as requested using react-toastify
      toast.warning(
        "To ensure swapping must completed 60x turnover of recharge volume. Once the criteria are met, funds may be moved to Earn-Wallet for withdrawal.",
        {
          autoClose: 6000,
        },
      );
      return;
    }

    // Direction B -> E (Withdrawal -> Available)
    if (Number(swapAmount) > withdrawableBalance) {
      toast.error("Insufficient withdrawal balance");
      return;
    }

    try {
      setSwapLoading(true);
      const res = await transferFunds(token, {
        amount: Number(swapAmount),
        direction: "BtoA",
      });
      toast.success(res.data.message || "Transfer successful");
      setSwapAmount("");
      setShowSwap(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Transfer failed");
    } finally {
      setSwapLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaMoneyBillWave className="mr-2 text-green-500" /> Withdraw Funds
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4 space-y-4">
          {/* Dashboard Cards with Swap Icon */}
          <div className="flex items-center gap-1 sm:gap-4 w-full">
            <div className="flex-1 bg-gray-50 p-2 sm:p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center shadow-sm min-w-0">
              <span className="text-gray-500 text-[7.5px] min-[320px]:text-[9px] min-[380px]:text-[10.5px] sm:text-xs mb-1 font-semibold uppercase tracking-tighter sm:tracking-wider text-center leading-tight whitespace-nowrap w-full">
                Available Amount
              </span>
              <span className="text-sm min-[320px]:text-base min-[400px]:text-xl sm:text-2xl font-bold text-gray-900 truncate">
                ${rechargeBalance.toFixed(2)}
              </span>
            </div>

            {/* Swap Trigger Button */}
            <div className="flex-shrink-0 bg-white p-0.5 sm:p-1 rounded-full shadow-sm border border-gray-200">
              <button
                onClick={() => setShowSwap(!showSwap)}
                className={`p-1.5 sm:p-2 rounded-full transition-all ${
                  showSwap
                    ? "bg-green-500 text-white rotate-180"
                    : "bg-gray-50 text-green-500 hover:bg-gray-100"
                }`}
                title="Swap funds between wallets"
              >
                <FaExchangeAlt className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>

            <div className="flex-1 bg-gray-50 p-2 sm:p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center shadow-sm min-w-0">
              <span className="text-gray-500 text-[7.5px] min-[320px]:text-[9px] min-[380px]:text-[10.5px] sm:text-xs mb-1 font-semibold uppercase tracking-tighter sm:tracking-wider text-center leading-tight whitespace-nowrap w-full">
                Withdrawal Amount
              </span>
              <span className="text-sm min-[320px]:text-base min-[400px]:text-xl sm:text-2xl font-bold text-gray-900 truncate">
                ${withdrawableBalance?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>

          {/* Swap UI Section */}
          {showSwap && (
            <div className="bg-green-50/50 border border-green-100 p-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-green-700 uppercase tracking-tight">
                  {swapDirection === "AtoB"
                    ? "Transfer to Withdrawal"
                    : "Transfer to Available"}
                </span>
                <button
                  onClick={() =>
                    setSwapDirection(swapDirection === "AtoB" ? "BtoA" : "AtoB")
                  }
                  className="text-[10px] font-bold text-green-600 hover:text-green-700 flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm border border-green-100"
                >
                  <FaExchangeAlt size={10} /> Switch Direction
                </button>
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  $
                </span>
                <input
                  type="number"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 outline-none text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                />
              </div>

              <button
                onClick={handleSwap}
                disabled={swapLoading}
                className="w-full py-2.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-sm disabled:opacity-50"
              >
                {swapLoading ? "Processing..." : "Confirm Transfer"}
              </button>
            </div>
          )}

          {/* Withdrawal Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Withdrawal Address
            </label>
            <input
              type="text"
              name="withdrawalAddress"
              value={form.withdrawalAddress}
              onChange={handleChange}
              placeholder="Enter your wallet address"
              className="w-full border rounded-md px-3 py-2 outline-none text-gray-900"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Withdraw Amount
            </label>
            <div className="flex items-center border rounded-md px-3 py-2">
              <span className="mr-2 text-gray-500">$</span>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Minimum withrawal amount is 30$"
                className="w-full outline-none text-gray-900"
                min="30"
              />
            </div>
            {form.amount && Number(form.amount) > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                <div>
                  Network handling fees (3.8%):{" "}
                  <span className="text-red-500">${fee}</span>
                </div>
                <div>
                  Net Amount:{" "}
                  <span className="text-green-600">${netAmount}</span>
                </div>
              </div>
            )}
          </div>

          {/* Withdrawal Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Withdrawal Method
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {/* Tether TRC20 Option */}
              <div
                onClick={() => {
                  setSelectedPayment("trc20");
                  setForm({ ...form, method: "USDT (TRC20)" });
                }}
                className={`relative border border-green-500 rounded-md p-2 sm:p-4 cursor-pointer transition-all ${
                  selectedPayment === "trc20" ? "ring-2 ring-green-600" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm sm:text-lg leading-tight text-green-500">
                      Tether
                    </div>
                    <div className="text-[10px] sm:text-sm text-gray-500 opacity-90">
                      USDT (TRC20)
                    </div>
                  </div>
                  <img
                    src="/tether-usdt-logo.png"
                    alt="USDT TRC20"
                    className="w-10 sm:w-16 h-auto object-contain"
                  />
                </div>
                {selectedPayment === "trc20" && (
                  <div className="absolute -top-1 -right-1">
                    <FaCheckCircle
                      className="text-green-500 bg-white rounded-full"
                      size={14}
                    />
                  </div>
                )}
              </div>

              {/* Tether BEP20 Option */}
              <div
                onClick={() => {
                  setSelectedPayment("bep20");
                  setForm({ ...form, method: "USDT (BEP20)" });
                }}
                className={`relative border border-green-500 rounded-md p-2 sm:p-4 cursor-pointer transition-all ${
                  selectedPayment === "bep20" ? "ring-2 ring-green-600" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm sm:text-lg leading-tight text-green-500">
                      Tether
                    </div>
                    <div className="text-[10px] sm:text-sm text-gray-500 opacity-90">
                      USDT (BEP20)
                    </div>
                  </div>
                  <img
                    src="/bdep.webp"
                    alt="USDT BEP20"
                    className="w-10 sm:w-16 h-auto object-contain"
                  />
                </div>
                {selectedPayment === "bep20" && (
                  <div className="absolute -top-1 -right-1">
                    <FaCheckCircle
                      className="text-green-500 bg-white rounded-full"
                      size={14}
                    />
                  </div>
                )}
              </div>

              {/* Easypaisa Option
              <div
                onClick={() => {
                  setSelectedPayment("easypaisa");
                  setForm({ ...form, method: "Easypaisa" });
                }}
                className={`relative border text-blue-600 border-blue-500 p-2 sm:p-4 rounded-md cursor-pointer transition-all ${
                  selectedPayment === "easypaisa" ? "ring-2 ring-blue-600" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm sm:text-lg">
                      Easypaisa
                    </div>
                    <div className="text-[10px] sm:text-sm opacity-90">
                      PKR Wallet
                    </div>
                  </div>
                  <img
                    src="/Easypaisa-logo.png"
                    alt="Easypaisa"
                    className="w-10 sm:w-16 h-auto"
                  />
                </div>
                {selectedPayment === "easypaisa" && (
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                    <FaCheckCircle className="text-blue-600" size={16} />
                  </div>
                )}
              </div>

              JazzCash Option
              <div
                onClick={() => {
                  setSelectedPayment("jazzcash");
                  setForm({ ...form, method: "JazzCash" });
                }}
                className={`relative border text-red-600 border-red-500 p-2 sm:p-4 rounded-md cursor-pointer transition-all ${
                  selectedPayment === "jazzcash" ? "ring-2 ring-red-600" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm sm:text-lg">
                      JazzCash
                    </div>
                    <div className="text-[10px] sm:text-sm opacity-90">
                      PKR Wallet
                    </div>
                  </div>
                  <img
                    src="/new-Jazzcash-logo.png"
                    alt="JazzCash"
                    className="w-10 sm:w-16 h-auto"
                  />
                </div>
                {selectedPayment === "jazzcash" && (
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                    <FaCheckCircle className="text-red-600" size={16} />
                  </div>
                )}
              </div>
               */}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleWithdraw}
            disabled={loading}
            className="w-full py-3 font-medium bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            {loading ? "Submitting..." : "Submit Withdrawal Request"}
          </button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="w-full py-3 font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
