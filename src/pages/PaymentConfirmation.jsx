"use client";

import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTimes, FaCheckCircle } from "react-icons/fa";
import { SiTether, SiVisa, SiMastercard } from "react-icons/si";
import { useNavigate } from "react-router-dom"; // ✅ for navigation
import { AuthContext } from "../context/AuthContext";
import { depositRequest } from "../api/paymentApi";

export default function PaymentConfirmationModal({
  isOpen,
  onClose,
  amount,
  orderNumber,
  onConfirm,
}) {
  const [activeTab, setActiveTab] = useState("online");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedOfflineMethod, setSelectedOfflineMethod] = useState(null);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const handlePayment = () => {
    if (!selectedPayment) {
      toast.warning("Please select a payment method");
      return;
    }
    onConfirm(selectedPayment);
  };

  const offlineOptions = [
    { id: 1, name: "Bank Transfer", img: "/public/bank.png" },
    {
      id: 2,
      name: "Easypaisa",
      img: "/Easypaisa-logo.png",
    },
    {
      id: 3,
      name: "JazzCash",
      img: "/new-Jazzcash-logo.png",
    },
    {
      id: 4,
      name: "Bkash",
      img: "/bkash.webp",
    },
    { id: 5, name: "Nagad", img: "/nagad.png" },
    { id: 6, name: "UPI", img: "/upi.jpg" },
  ];

  const handleOfflineDeposit = (opt) => {
    setSelectedOfflineMethod(opt);
    setShowInstructions(true);
  };

  const handleProceedOffline = async () => {
    if (!selectedOfflineMethod) return;
    try {
      // Prepare deposit data
      const depositData = {
        amount: Number(amount),
        method: selectedOfflineMethod.name,
        screenshot: null, // Optional, can add later
      };
      // Call API to create pending deposit
      await depositRequest(token, depositData);
      // Navigate to chat-support page
      navigate("/chat-support", {
        state: { method: selectedOfflineMethod.name, amount },
      });
    } catch (error) {
      toast.error("Failed to create deposit request. Please try again.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Confirmation
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Order Details */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">
                Recharge order number:{" "}
                <span className="text-gray-900">{orderNumber}</span>
              </p>
              <p className="text-sm text-gray-600">
                Deposit amount:{" "}
                <span className="text-red-500 font-semibold">${amount}</span>
              </p>
            </div>

            {/* Tabs */}
            <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("online")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "online"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Online deposit
              </button>
              <button
                onClick={() => setActiveTab("offline")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "offline"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Offline deposit
              </button>
            </div>

            {/* Online Deposit Options */}
            {activeTab === "online" && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Payment options
                </h3>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Tether TRC20 Option */}
                  <div
                    onClick={() => setSelectedPayment("trc20")}
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
                    onClick={() => setSelectedPayment("bep20")}
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
                </div>

                {/* 
                TRX Option
                <div
                  className={`relative border text-gray-400 border-gray-200 p-4 rounded-md mb-3 cursor-not-allowed opacity-60 transition-all`}
                >
                  <div className="flex items-center justify-between text-gray-500">
                    <div>
                      <div className="font-semibold text-lg">TRX</div>
                      <div className="text-sm opacity-90">Tron (Disabled)</div>
                    </div>
                    <div className="w-8 h-8 rounded flex items-center justify-center grayscale">
                      <img src="/trx.png" alt="TRX" className="w-32" />{" "}
                    </div>
                  </div>
                </div>

                EasyPaisa SafePay
                <div
                  onClick={() => setSelectedPayment("easypaisa")}
                  className={`relative border text-blue-600 border-blue-500 p-4 rounded-md mb-3 cursor-pointer transition-all ${
                    selectedPayment === "easypaisa"
                      ? "ring-2 ring-blue-600"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">EasyPaisa</div>
                      <div className="text-sm opacity-90">Instant Payment</div>
                    </div>
                    <img
                      src="/Easypaisa-logo.png"
                      alt="Easypaisa"
                      className="w-16 h-auto"
                    />
                  </div>
                  {selectedPayment === "easypaisa" && (
                    <div className="absolute top-2 right-2">
                      <FaCheckCircle className="text-blue-600" size={20} />
                    </div>
                  )}
                </div>

                JazzCash SafePay
                <div
                  onClick={() => setSelectedPayment("jazzcash")}
                  className={`relative border text-red-600 border-red-500 p-4 rounded-md mb-3 cursor-pointer transition-all ${
                    selectedPayment === "jazzcash" ? "ring-2 ring-red-600" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">JazzCash</div>
                      <div className="text-sm opacity-90">Instant Payment</div>
                    </div>
                    <img
                      src="/new-Jazzcash-logo.png"
                      alt="JazzCash"
                      className="w-16 h-auto"
                    />
                  </div>
                  {selectedPayment === "jazzcash" && (
                    <div className="absolute top-2 right-2">
                      <FaCheckCircle className="text-red-600" size={20} />
                    </div>
                  )}
                </div>

                Card Options
                <div
                  className={`relative bg-gray-100 p-4 mb-3 cursor-not-allowed opacity-60 transition-all`}
                >
                  <div className="flex items-center justify-center space-x-4 grayscale opacity-50">
                    <SiVisa size={32} />
                    <SiMastercard size={32} />
                  </div>
                  <div className="text-center text-xs text-gray-500 mt-1">
                    (Temporarily Disabled)
                  </div>
                </div>
                */}

                {/* Confirm Button */}
                <button
                  onClick={() => handlePayment(selectedPayment)}
                  className="w-full mt-4 py-3 font-medium bg-green-500 text-white hover:bg-green-600 transition-colors cursor-pointer"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Offline Deposit Options */}
            {activeTab === "offline" && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Select a method
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {offlineOptions.map((opt) => (
                    <div
                      key={opt.id}
                      className="border border-green-500 p-2 sm:p-4 flex items-center justify-between rounded-lg cursor-pointer transition-all hover:bg-green-50"
                      onClick={() => handleOfflineDeposit(opt)}
                    >
                      <p className="text-sm sm:text-lg font-semibold text-green-500 truncate mr-2">
                        {opt.name}
                      </p>
                      <img
                        src={opt.img}
                        alt={opt.name}
                        className="w-10 sm:w-16 h-auto object-contain flex-shrink-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offline Instructions Modal */}
      {showInstructions && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-[60] p-4"
          onClick={() => setShowInstructions(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-green-500 p-4 text-white text-center">
              <h3 className="text-lg font-bold">
                Offline Deposit Instructions
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  1
                </div>
                <p className="text-gray-700 text-sm">
                  Click <strong>[Chat with Support]</strong> to get our current
                  bank/wallet info.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  2
                </div>
                <p className="text-gray-700 text-sm">
                  Pay with your local currency to the provided account.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  3
                </div>
                <p className="text-gray-700 text-sm">
                  Upload a screenshot of your payment in the chat.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  4
                </div>
                <p className="text-gray-700 text-sm font-medium">
                  After successfully, amount will be credit automatically to
                  wallet.
                </p>
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="flex-1 py-2 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedOffline}
                  className="flex-1 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all shadow-md shadow-green-200"
                >
                  Proceed to Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
