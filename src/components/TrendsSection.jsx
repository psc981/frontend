"use client";

import { useState, useEffect, useContext } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getBasicStats } from "../api/api"; // Adjust path if needed
import { AuthContext } from "../context/AuthContext";
import Spinner from "./Spinner";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TrendsSection() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    async function fetchStats() {
      if (!token) return;
      setLoading(true);
      try {
        const res = await getBasicStats(token);
        setStats(res.data);
      } catch (err) {
        setStats(null);
      }
      setLoading(false);
    }
    fetchStats();
  }, [token]);

  const data = {
    labels: ["Total Sales", "Total Profit"],
    datasets: [
      {
        label: "Stats",
        data: stats ? [stats.totalSales, stats.totalProfit] : [0, 0],
        backgroundColor: ["#22c55e", "#f59e42"],
        borderColor: ["#16a34a", "#ea580c"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "bottom" },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="mb-6 w-full">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Sales & Profit Overview
        </h2>
        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">?</span>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 h-64 w-full flex items-center justify-center">
        {loading ? (
          <Spinner />
        ) : stats ? (
          <Pie data={data} options={options} />
        ) : (
          <p className="text-red-500">Failed to load stats.</p>
        )}
      </div>
    </div>
  );
}
