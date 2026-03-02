import React from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Help() {
  const navigate = useNavigate();

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
        <FaQuestionCircle className="text-green-500" /> Help
      </h1>

      <div className="flex flex-col items-center text-center mt-10">
        <div className="mb-8">
          <img
            src="/help.png"
            alt="Help illustration"
            className="w-64 h-64 object-contain"
          />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Need Assistance?
        </h2>
        <p className="text-gray-600 mb-10">
          Check our support resources or contact us.
        </p>

        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => navigate("/faqs")}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-md transition duration-300 uppercase"
          >
            Browse Help Center
          </button>

          <button
            onClick={() => navigate("/chat-support")}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-md transition duration-300 uppercase"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
