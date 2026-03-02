import { useState, useContext } from "react";
import {
  FaChevronRight,
  FaBars,
  FaTimes,
  FaHeart,
  FaShoppingBag,
  FaComments,
  FaUsers,
  FaCheckCircle,
  FaEnvelope,
  FaUndo,
  FaTimesCircle,
  FaCog,
  FaFileAlt,
  FaCommentDots,
  FaQuestionCircle,
  FaInfoCircle,
  FaQuestion,
  FaSignOutAlt,
  FaWallet,
  FaCopy,
  FaLink,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const copyUsername = async () => {
    const textToCopy = user?.username || user?.name;
    if (textToCopy) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        toast.success("Username copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy username:", err);
        toast.error("Failed to copy username");
      }
    }
  };

  const navLinks = [
    { name: "Psc Wallet", href: "/wallet", icon: <FaWallet /> },
    { name: "My Orders", href: "/my-orders", icon: <FaShoppingBag /> },
    {
      name: "My Wishlist & Followed Store",
      href: "/wishlist",
      icon: <FaHeart />,
    },
    { name: "My Cart", href: "/cart", icon: <FaShoppingBag /> },
    { name: "Partners", href: "/partners", icon: <FaUsers /> },
    { name: "Partner Stores", href: "/referral", icon: <FaUsers /> },
    { name: "Store KYC Verification", href: "/kyc", icon: <FaCheckCircle /> },
    { name: "Chat with Us", href: "/chat-support", icon: <FaComments /> },
    { name: "Announce", href: "/messages", icon: <FaEnvelope /> },
    { name: "My Returns", href: "/returns", icon: <FaUndo /> },
    {
      name: "My Cancellation",
      href: "/cancellations",
      icon: <FaTimesCircle />,
    },
    { name: "Account Settings", href: "/settings", icon: <FaCog /> },
    { name: "Policies", href: "/privacypolicy", icon: <FaFileAlt /> },
    { name: "Feedback", href: "/feedback", icon: <FaCommentDots /> },
    { name: "Help", href: "/help", icon: <FaQuestionCircle /> },
    { name: "About", href: "/about", icon: <FaInfoCircle /> },
    { name: "FAQs", href: "/faqs", icon: <FaQuestion /> },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 relative">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">◊</span>
          </div>
          <Link
            to="/products"
            className="font-bold text-green-600 capitalize sm:text-sm text-xs"
          >
            PSC
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Profile Avatar */}
          <Link to="/profile" className="relative">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-gray-300 cursor-pointer"
              />
            ) : (
              <div className="w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center rounded-full text-sm font-bold cursor-pointer">
                {(user?.storeName || user?.username || "G")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
            {user?.isKycApproved && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <FaCheckCircle className="text-green-500 text-[10px]" />
              </div>
            )}
          </Link>

          {/* Language Switch */}
          <div className="flex items-center gap-1 cursor-pointer">
            <img
              src="/united-kingdom.png"
              alt="UK Flag"
              className="w-5 h-4 rounded"
            />
            <span className="text-sm font-medium">EN</span>
            <FaChevronRight className="text-gray-400 text-xs" />
          </div>

          {/* Hamburger Menu */}
          <button
            className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars className="text-white text-lg" />
          </button>
        </div>
      </div>
      {/* Mobile + Desktop Dropdown (works everywhere now) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 right-0 h-screen w-4/5 max-w-sm bg-white shadow-lg z-[100] flex flex-col"
          >
            {/* Header with Profile */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-green-50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {user?.profileImage ? (
                    <img
                      src={user?.profileImage}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center rounded-full text-lg font-bold">
                      {(user?.storeName || user?.username || "G")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                  {user?.isKycApproved && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <FaCheckCircle className="text-green-500 text-xs" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Link to="/profile" onClick={() => setMenuOpen(false)}>
                      <h4 className="font-semibold text-gray-800">
                        {user?.storeName || user?.username || "Guest"}
                      </h4>
                    </Link>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-500">
                      {user?.username
                        ? `@${user.username}`
                        : user?.isKycApproved
                          ? "Verified User"
                          : "Unverified"}
                    </p>
                    {user?.username && (
                      <button
                        onClick={copyUsername}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy username"
                      >
                        <FaCopy className="text-xs" />
                      </button>
                    )}
                  </div>
                  {user?.username && (
                    <p className="text-[10px] text-gray-400">
                      {user?.isKycApproved ? "Verified User" : "Unverified"}
                    </p>
                  )}
                </div>
              </div>
              <button
                className="text-gray-600 text-2xl"
                onClick={() => setMenuOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* Scrollable Nav Links */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              <div className="flex flex-col gap-3">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="text-base">{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sign Out */}
            <div className="border-t border-gray-200 p-4 pb-10 flex-shrink-0">
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 text-red-600 font-medium p-2 rounded-lg hover:bg-red-50"
              >
                <FaSignOutAlt className="text-lg" />
                <span className="text-base">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
