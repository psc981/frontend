import React, { useState, useEffect, useContext } from "react";
import {
  FaUsers,
  FaUserCircle,
  FaGift,
  FaWhatsapp,
  FaChartLine,
  FaGlobe,
  FaStar,
  FaCrown,
  FaGem,
  FaRocket,
  FaBullseye,
} from "react-icons/fa";
import { FiCopy, FiCheck } from "react-icons/fi";
import { getMyReferrals } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function Referral() {
  const { user, token } = useContext(AuthContext);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [openDetails, setOpenDetails] = useState({}); // Track open/close state
  const referralCode = user?.referralCode || "1234567890";
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const rewardTiers = [
    {
      title: "Starter",
      friends: "3 Active Friend Stores",
      friendFunds: "$200 Total Friend Store Funds",
      yourFunds: "$100 Your Store Funds",
      commission: "$30 Commission",
      salary: "$5 Monthly Salary",
      icon: <FaRocket className="text-blue-500" />,
    },
    {
      title: "Growth",
      friends: "10 Active Friend Stores",
      friendFunds: "$1,000 Total Friend Store Funds",
      yourFunds: "$300 Your Store Funds",
      commission: "$100 Commission",
      salary: "$20 Monthly Salary",
      icon: <FaChartLine className="text-green-500" />,
    },
    {
      title: "Expansion",
      friends: "20 Active Friend Stores",
      friendFunds: "$3,000 Total Friend Store Funds",
      yourFunds: "$500 Your Store Funds",
      commission: "$300 Commission",
      salary: "$50 Monthly Salary",
      icon: <FaGlobe className="text-purple-500" />,
    },
    {
      title: "Elite",
      friends: "30 Active Friend Stores",
      friendFunds: "$5,000 Total Friend Store Funds",
      yourFunds: "$700 Your Store Funds",
      commission: "$400 Commission",
      salary: "$70 Monthly Salary",
      icon: <FaCrown className="text-red-500" />,
    },
    {
      title: "Master",
      friends: "40 Active Friend Stores",
      friendFunds: "$7,500 Total Friend Store Funds",
      yourFunds: "$800 Your Store Funds",
      commission: "$500 Commission",
      salary: "$100 Monthly Salary",
      icon: <FaBullseye className="text-orange-500" />,
    },
    {
      title: "Premium",
      friends: "70 Active Friend Stores",
      friendFunds: "$10,000 Total Friend Store Funds",
      yourFunds: "$1,000 Your Store Funds",
      commission: "$750 Commission",
      salary: "$125 Monthly Salary",
      icon: <FaStar className="text-red-500" />,
    },
    {
      title: "Diamond",
      friends: "100 Active Friend Stores",
      friendFunds: "$12,500 Total Friend Store Funds",
      yourFunds: "$1,250 Your Store Funds",
      commission: "$1,000 Commission",
      salary: "$200 Monthly Salary",
      icon: <FaGem className="text-blue-400" />,
    },
  ];

  const investmentCommissions = [
    { level: "Level 1", rate: "5%", locked: "200$" },
    { level: "Level 2", rate: "4.2%", locked: "400$" },
    { level: "Level 3", rate: "3.2%", locked: "600$" },
    { level: "Level 4", rate: "2.5%", locked: "800$" },
    { level: "Level 5", rate: "1.5%", locked: "1000$" },
    { level: "Level 6", rate: "0.7%", locked: "1200$" },
  ];

  useEffect(() => {
    if (!token) return;
    getMyReferrals(token)
      .then((res) => {
        setReferrals(res.data.referrals || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mask email helper
  const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    return name.slice(0, 2) + "***@" + domain;
  };

  // Toggle details
  const toggleDetails = (id) => {
    setOpenDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50 pb-20">
      {/* Invite Your Friends Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          Invite Your Friends
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-sm flex items-center gap-2 hover:bg-green-700 transition"
          >
            {copied ? <FiCheck /> : "Copy Referral Link"}
          </button>
          <a
            href={`https://wa.me/?text=Join me on Partner Seller Centre: ${referralLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-xl shadow-sm hover:bg-green-600 transition"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-blue-600 text-white p-3 rounded-xl text-center shadow-md">
          <p className="text-[10px] sm:text-xs font-medium opacity-90 leading-tight">
            Total Team Members
          </p>
          <p className="text-xl sm:text-2xl font-bold mt-1">
            {referrals.length}
          </p>
        </div>
        <div className="bg-green-500 text-white p-3 rounded-xl text-center shadow-md">
          <p className="text-[10px] sm:text-xs font-medium opacity-90 leading-tight">
            Active Stores
          </p>
          <p className="text-xl sm:text-2xl font-bold mt-1">
            {referrals.filter((r) => r.isActive).length || 0}
          </p>
        </div>
        <div className="bg-red-500 text-white p-3 rounded-xl text-center shadow-md flex flex-col justify-center relative">
          <p className="text-[10px] sm:text-xs font-medium opacity-90 leading-tight">
            Inactive Stores
          </p>
          <p className="text-xl sm:text-2xl font-bold mt-1">
            {referrals.filter((r) => !r.isActive).length || 0}
          </p>
          <span className="absolute top-1 right-2 text-white font-bold text-xs">
            ×
          </span>
        </div>
      </div>

      {/* Commission Rates Sections */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">
          Store's Investment Commission
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {investmentCommissions.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">
                  {idx % 3 === 0 ? (
                    <FaStar className="text-yellow-400" />
                  ) : idx % 3 === 1 ? (
                    <FaBullseye className="text-blue-500" />
                  ) : (
                    <FaBullseye className="text-green-500" />
                  )}
                </span>
                <span className="font-bold text-gray-800 text-base">
                  {item.level}
                </span>
              </div>

              <div className="mb-4 flex-grow">
                <p className="text-gray-500 text-xs mb-1">Team Commission:</p>
                <div className="space-y-0.5">
                  <p className="font-bold text-gray-800 text-sm">{item.rate}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-2 flex justify-between items-center px-3 mt-auto">
                <span className="text-gray-500 text-xs flex items-center gap-1">
                  Locked 🔐
                </span>
                <span className="font-bold text-gray-800 text-sm">
                  {item.locked}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reward Tiers */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Your Rewards Tiers
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {rewardTiers.map((tier, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-3">
                {tier.icon}
                <span className="font-bold text-gray-800">{tier.title}</span>
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                <p>{tier.friends}</p>
                <p>{tier.friendFunds}</p>
                <p>{tier.yourFunds}</p>
                <p>{tier.commission}</p>
                {tier.salary && <p>{tier.salary}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
