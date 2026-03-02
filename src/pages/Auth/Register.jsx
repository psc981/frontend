"use client";

import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiBell, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { registerWithUsername, registerWithOtp, sendOtp } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("Account");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [formData, setFormData] = useState({
    storeName: "",
    email: "",
    verificationCode: "",
    username: "",
    password: "",
    invitationCode: "",
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const refParam = searchParams.get("ref");
    if (refParam) {
      setFormData((prev) => ({
        ...prev,
        invitationCode: refParam,
      }));
    }
  }, [location]);

  const handleObtainCode = async () => {
    if (!formData.email) return toast.error("Enter your email first!");

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      return toast.error("Please enter a valid email address");

    try {
      await sendOtp({ email: formData.email });
      setOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (err) {
      toast.error("Error sending OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === "Email") {
      if (!otpSent) return toast.error("Obtain OTP first");
      if (!formData.verificationCode) return toast.error("Enter OTP");
      if (!formData.storeName) return toast.error("Enter store name");
      if (!formData.username) return toast.error("Enter username");
      if (!formData.password) return toast.error("Set password");
      if (!formData.invitationCode) return toast.error("Enter invitation code");
      if (!agreed) return toast.error("Agree to terms");

      try {
        const data = {
          email: formData.email,
          otp: formData.verificationCode,
          password: formData.password,
          storeName: formData.storeName,
          username: formData.username,
          referralCode: formData.invitationCode,
        };
        const res = await registerWithOtp(data);

        toast.success("Registration successful!");
        login(res.data.token);
        navigate("/products");
      } catch (err) {
        const errorMsg = err.response?.data?.error || "OTP verification failed";
        toast.error(errorMsg);
      }
    }

    if (activeTab === "Account") {
      if (!formData.storeName) return toast.error("Enter store name");
      if (!formData.username) return toast.error("Enter username");
      if (!formData.email) return toast.error("Enter email");
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email))
        return toast.error("Please enter a valid email address");
      if (!formData.password) return toast.error("Enter password");
      if (!formData.invitationCode) return toast.error("Enter invitation code");
      if (!agreed) return toast.error("Agree to terms");

      try {
        const data = {
          storeName: formData.storeName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          invitationCode: formData.invitationCode,
        };
        const res = await registerWithUsername(data);

        toast.success("Account registration successful!");
        login(res.data.token);
        navigate("/products");
      } catch (err) {
        const errorMsg =
          err.response?.data?.error || "Account registration failed";
        toast.error(errorMsg);
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">◊</span>
          </div>
          <span className="text-green-600 font-bold text-xl">PSC</span>
        </div>
        <div className="flex items-center space-x-4">
          <FiBell className="text-gray-600" size={20} />
          <FiUser className="text-gray-600" size={20} />
        </div>
      </header>

      {/* Main Form */}
      <main className="px-4 py-6 flex-1 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-2xl font-bold text-center mb-6">Sign up</h1>

          {/* Tabs */}
          <div className="flex mb-6">
            {["Account", "Email"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-green-500 text-green-600 font-medium"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {/* Account Form */}
            {activeTab === "Account" && (
              <>
                {/* Store Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) =>
                      setFormData({ ...formData, storeName: e.target.value })
                    }
                    placeholder="Enter your store name"
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    required
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Enter your username"
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Set login password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Set login password"
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Email Form */}
            {activeTab === "Email" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Please enter your email"
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    required
                  />
                </div>

                {/* Verification Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.verificationCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          verificationCode: e.target.value,
                        })
                      }
                      placeholder="Enter OTP"
                      className="flex-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleObtainCode}
                      className="px-4 py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors font-medium text-sm whitespace-nowrap"
                    >
                      {otpSent ? "Resend OTP" : "Get OTP"}
                    </button>
                  </div>
                </div>

                {/* Store Name for Email Tab */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) =>
                      setFormData({ ...formData, storeName: e.target.value })
                    }
                    placeholder="Enter your store name"
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    required
                  />
                </div>

                {/* Username for Email Tab */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Enter your username"
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    required
                  />
                </div>

                {/* Password for Email Tab */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Set login password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Set login password"
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Invitation Code (Global) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invitation code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.invitationCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    invitationCode: e.target.value,
                  })
                }
                placeholder="Enter 10-digit code"
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                required
              />
            </div>

            <div className="flex items-start space-x-2 py-2">
              <input
                type="checkbox"
                id="agreement"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="agreement" className="text-sm text-gray-600">
                Read and agree 'Service agreement' and 'Privacy policy'?
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium mt-6"
            >
              {activeTab === "Email"
                ? "Verify OTP & Complete Registration"
                : "Create Account"}
            </button>
          </form>
          <p className="text-center mt-6 text-gray-600">
            Already registered?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
