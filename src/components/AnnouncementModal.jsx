import React, { useEffect } from "react";
import { FiX, FiBell } from "react-icons/fi";
import SocialLinks from "./SocialLinks";

const AnnouncementModal = ({ isOpen, onClose, announcement }) => {
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

  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-green-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            <FiBell className="text-xl animate-bounce" />
            <h2 className="text-xl font-bold">Important Announcement</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-green-700 rounded-full p-1 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {announcement.title}
          </h3>
          <div className="prose prose-green max-w-none text-gray-600 leading-relaxed max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {announcement.message.split("\n").map((line, i) => (
              <p key={i} className="mb-3">
                {line}
              </p>
            ))}
          </div>

          {/* Social Links */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col items-center">
            <SocialLinks
              size={32}
              className="flex flex-row flex-wrap justify-center gap-4"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform active:scale-95 transition-all shadow-md"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
