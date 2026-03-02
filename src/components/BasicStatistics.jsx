import { useEffect, useState, useContext } from "react";
import StatCard from "./StatCard";
import { FaDiamond, FaChartPie, FaMoneyBill, FaTag } from "react-icons/fa6";
import { getBasicStats } from "../api/api";
import { AuthContext } from "../context/AuthContext"; // Adjust path as needed
import Spinner from "./Spinner";

export default function BasicStatistics() {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getBasicStats(token)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) return <Spinner />;
  if (!stats) return <div>Failed to load statistics.</div>;

  const profitPercent =
    stats.totalSales && stats.totalSales > 0
      ? ((stats.totalProfit / stats.totalSales) * 100).toFixed(2)
      : "0.00";

  const statCards = [
    {
      title: "Total Spend",
      value: stats.totalSales?.toFixed(2) ?? "0.00",
      subtitle: `Current month sales ${
        stats.currentMonthSales?.toFixed(2) ?? "0.00"
      }\nLast month's sales ${stats.lastMonthSales?.toFixed(2) ?? "0.00"}`,
      icon: <FaDiamond />,
      iconColor: "text-green-500",
    },
    {
      title: "Available balance",
      value: stats.availableBalance?.toFixed(2) ?? "0.00",
      subtitle: `In transaction ${
        stats.inTransaction?.toFixed(2) ?? "0.00"
      }\nNumber of complaints ${stats.complaints ?? 0}`,
      icon: <FaChartPie />,
      iconColor: "text-blue-500",
    },
    {
      title: "Total profit",
      value: stats.totalProfit?.toFixed(2) ?? "0.00",
      subtitle: `Profit for the month ${
        stats.profitThisMonth?.toFixed(2) ?? "0.00"
      }\nLast month's profit ${
        stats.profitLastMonth?.toFixed(2) ?? "0.00"
      }\nTotal profit rate: ${profitPercent}%`,
      icon: <FaMoneyBill />,
      iconColor: "text-green-500",
    },
    {
      title: "Total number of orders",
      value: stats.totalOrders ?? 0,
      subtitle: `Orders for the current month ${
        stats.ordersThisMonth ?? 0
      }\nLast month's order ${stats.ordersLastMonth ?? 0}`,
      icon: <FaTag />,
      iconColor: "text-green-500",
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Basic Statistics
        </h2>
        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">?</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>
    </div>
  );
}
