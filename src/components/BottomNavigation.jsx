// src/components/BottomNavigation.jsx
import {
  FaCog,
  FaShoppingCart,
  FaWallet,
  FaHome,
  FaUsers,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <FaHome />, label: "Homepage", path: "/products" },
    { icon: <FaCog />, label: "Operations Center", path: "/dashboard" },
    // { icon: <FaWallet />, label: "My Wallet", path: "/wallet" },
    { icon: <FaShoppingCart />, label: "Order Center", path: "/orders" },
    // { icon: <FaHome />, label: "Home Page", path: "" },
    { icon: <FaUsers />, label: "Partners", path: "/partners" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 p-2 ${
              location.pathname === item.path
                ? "text-green-500"
                : "text-gray-500"
            }`}
          >
            <div className="text-lg">{item.icon}</div>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
