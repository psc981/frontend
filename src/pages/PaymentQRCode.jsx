"use client";

import { useState } from "react";
import { FaTimes, FaRegCopy } from "react-icons/fa";

export default function PaymentQRCode({
  amount,
  orderNumber,
  address,
  network,
  onClose,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Complete your {network || "TRC20"} Payment
        </h2>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${address}&size=200x200`}
            alt={`${network || "TRC20"} QR Code`}
            className="rounded-lg border p-2"
          />
        </div>

        {/* Address with Copy */}
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-4">
          <span className="text-sm font-mono break-all">{address}</span>
          <button
            onClick={handleCopy}
            className="text-gray-600 hover:text-gray-900"
          >
            <FaRegCopy />
          </button>
        </div>
        {copied && (
          <p className="text-green-500 text-sm mb-4">Copied to clipboard!</p>
        )}

        {/* Amount and Order Number */}
        <div className="mb-2 text-gray-700">
          <p>
            Amount:{" "}
            <span className="font-semibold text-red-500">${amount}</span>
          </p>
          <p>
            Order ID: <span className="font-semibold">{orderNumber}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
