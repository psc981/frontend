"use client";

import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiBell, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { loginAdmin } from "../../api/api";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username) return toast.error("Enter admin username!");
    if (!formData.password) return toast.error("Enter admin password!");

    try {
      const res = await loginAdmin({
        username: formData.username,
        password: formData.password,
      });

      const userRole = res.data.admin.role;
      login(res.data.token, userRole);
      toast.success("Admin Login successful 🎉");
      navigate("/psc");
    } catch (err) {
      toast.error(err.response?.data?.error || "Admin login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">◊</span>
          </div>
          <span className="text-red-600 font-bold text-xl">PSC ADMIN</span>
        </div>
        <div className="flex items-center space-x-4">
          <FiBell className="text-gray-600" size={20} />
          <FiUser className="text-gray-600" size={20} />
          <div className="flex items-center space-x-1">
            <img src="/united-kingdom.png" alt="UK" className="w-5 h-3" />
            <span className="text-sm text-gray-600">EN</span>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="px-4 py-6 flex-1 w-full flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-700 mb-6 text-center">
            Admin Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Enter admin username"
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter admin password"
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium mt-6 cursor-pointer"
            >
              Login as Admin
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
