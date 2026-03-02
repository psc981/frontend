import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import SocialLinks from "./SocialLinks";

const SocialLinksModal = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/40 backdrop-blur-sm transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg transform transition-all animate-in slide-in-from-top duration-500 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 pt-10">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>

          <SocialLinks
            size={24}
            className="flex flex-row justify-center gap-3"
            showTitle={true}
          />
        </div>
      </div>
    </div>
  );
};

export default SocialLinksModal;
