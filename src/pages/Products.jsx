import React, { useState, useEffect } from "react";
import ProductsHeader from "../components/Products/ProductsHeader.jsx";
import ProductGrid from "../components/Products/ProductGrid.jsx";
import Footer from "./Footer.jsx";
import AnnouncementModal from "../components/AnnouncementModal";
import { getAnnouncements } from "../api/api";

export default function Products() {
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);

  useEffect(() => {
    const fetchLatestAnnouncement = async () => {
      try {
        const hasShown = sessionStorage.getItem("announcementShown");
        if (hasShown) return;

        const res = await getAnnouncements();
        if (res.data.announcements && res.data.announcements.length > 0) {
          setLatestAnnouncement(res.data.announcements[0]);
          setShowAnnouncement(true);
        }
      } catch (err) {
        console.error("Error fetching announcement:", err);
      }
    };

    fetchLatestAnnouncement();
  }, []);

  const handleCloseAnnouncement = () => {
    setShowAnnouncement(false);
    sessionStorage.setItem("announcementShown", "true");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto min-h-screen">
        <ProductsHeader />
        <div className="px-4 pb-24">
          <ProductGrid />
        </div>
        <Footer />
      </div>

      <AnnouncementModal
        isOpen={showAnnouncement}
        onClose={handleCloseAnnouncement}
        announcement={latestAnnouncement}
      />
    </div>
  );
}
