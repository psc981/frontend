import React from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // 'danger' | 'success' | 'warning'
}) => {
  if (!isOpen) return null;

  const typeClasses = {
    danger: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
    success: "bg-green-500 hover:bg-green-600 focus:ring-green-500",
    warning: "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500",
  };

  const iconColors = {
    danger: "text-red-500",
    success: "text-green-500",
    warning: "text-yellow-500",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start">
            <div
              className={`flex-shrink-0 p-2 rounded-full bg-opacity-10 mr-4 ${iconColors[
                type
              ].replace("text", "bg")}`}
            >
              <FaExclamationTriangle
                className={`w-6 h-6 ${iconColors[type]}`}
              />
            </div>
            <div>
              <p className="text-gray-600 leading-relaxed">{message}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${typeClasses[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
