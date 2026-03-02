import React from "react";
import SocialLinks from "../components/SocialLinks";

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="w-full p-6 flex flex-col items-center">
        {/* Top Section */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-green-500">
            Partner Seller Centre
          </h2>
        </div>

        <SocialLinks size={24} className="flex gap-6 mb-8" />

        {/* Copyright */}
        <div className="text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} - All rights reserved by
          partnersellercentre.shop
        </div>
      </div>
    </footer>
  );
}

export default Footer;
