import React, { useEffect } from "react";
import { FaComments } from "react-icons/fa";
import { Crisp } from "crisp-sdk-web";

export default function Chat() {
  useEffect(() => {
    const crispId = import.meta.env.VITE_CRISP_WEBSITE_ID;

    if (!crispId) {
      console.error("Crisp website ID is not set!");
      return;
    }

    Crisp.configure(crispId);
  }, []);

  const openChat = () => {
    Crisp.chat.open();
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
        <FaComments className="text-green-500" /> Offline Recharge Steps
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 border border-green-200 mb-6">
        <h2 className="text-2xl font-bold text-green-600 mb-6 text-start">
          Recharge Instructions
        </h2>

        <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg mb-4 shadow-sm text-gray-800 leading-relaxed space-y-4">
          <p>
            To initiate an offline recharge, start by chatting with our customer
            support team. They will guide you through the process and provide a
            payment link or the necessary payment details for your requested
            recharge amount.
          </p>
          <p>
            Once you receive the payment link or details, copy them carefully
            and make the payment. After completing your payment, please add the{" "}
            <strong>Transaction ID/UTR</strong> to finalize your recharge
            request. Make sure to pay the <strong>exact amount</strong> that was
            requested to avoid any delays.
          </p>
          <p>
            Once payment is made, kindly wait for the confirmation and credit of
            your recharge. Providing a <strong>payment screenshot</strong> can
            help our team verify your transaction more quickly and ensure faster
            processing.
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-yellow-700 mb-2">
            Important Caution
          </h3>
          <p className="text-gray-800 leading-relaxed">
            Please make sure to pay the <strong>exact amount</strong> as
            instructed and always provide your{" "}
            <strong>Transaction ID/UTR</strong>. Failure to provide correct
            payment details or transaction proof may result in your recharge
            amount not being credited.
          </p>
        </div>

        <button
          onClick={openChat}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md"
        >
          Chat with Support
        </button>
      </div>
    </div>
  );
}
