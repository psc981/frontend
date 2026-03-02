// src/components/DashboardLayout.jsx
import React from "react";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import Footer from "../pages/Footer";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow px-4 py-6 pb-20 max-w-full mx-auto w-full">
        {children}
      </main>

      <BottomNavigation />
    </div>
  );
}
