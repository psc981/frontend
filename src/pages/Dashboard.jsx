// src/pages/Dashboard.jsx
import React from "react";
import BasicStatistics from "../components/BasicStatistics";
import TrendsSection from "../components/TrendsSection";
import Footer from "./Footer";

export default function Dashboard() {
  return (
    <>
      <BasicStatistics />
      <TrendsSection />
      <Footer />
    </>
  );
}
