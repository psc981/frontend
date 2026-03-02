import React, { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";

export default function Feedback() {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    // Handle feedback submission logic here
    console.log("Feedback submitted:", feedback);
    setFeedback("");
    alert("Thank you for your feedback!");
  };

  return (
    <div className="p-4 min-h-screen bg-white">
      <h1 className="text-3xl font-bold text-green-600 mb-2 flex items-center gap-3">
        <FiRefreshCw className="text-green-500 text-2xl" /> Feedback
      </h1>

      <div className="flex flex-col items-center">
        <p className="text-gray-500 text-lg mb-8 self-start">
          Share your experience with us.
        </p>

        <div className="mb-4">
          <img
            src="/feedback.png"
            alt="Feedback illustration"
            className="w-72 h-72 object-contain"
          />
        </div>

        <div className="w-full max-w-sm px-2">
          <div className="mb-6">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you think..."
              className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[120px] shadow-sm italic text-gray-600"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-md transition duration-300 uppercase tracking-wide"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
