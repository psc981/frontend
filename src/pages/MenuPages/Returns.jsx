import React from "react";
import { FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Returns() {
  const navigate = useNavigate();

  return (
    <div className="p-4 min-h-screen bg-white">
      {/* Header */}
      <h1 className="text-3xl font-bold text-green-600 mb-2 flex items-center gap-3">
        <FiRefreshCw className="text-green-500 text-2xl" /> My Returns
      </h1>

      <p className="text-gray-400 text-lg mb-8">No items in wishlist yet.</p>

      <div className="flex flex-col items-center text-center mt-10">
        <div className="mb-8">
          <img
            src="/My Returns.png"
            alt="No returns"
            className="w-72 h-72 object-contain"
          />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          No Product Returns Yet
        </h2>
        <p className="text-gray-600 mb-10 px-4">
          Initiate a return for items you need to send back.
        </p>

        <div className="w-full max-w-sm px-2">
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-md transition duration-300 uppercase tracking-wide"
          >
            Initiate a Return
          </button>
        </div>
      </div>
    </div>
  );
}
