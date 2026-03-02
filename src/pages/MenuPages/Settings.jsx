import React, { useState, useContext, useEffect } from "react";
import { FaCog } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { getSettings, updateSettings } from "../../api/api";
import { toast } from "react-toastify";

export default function Settings() {
  const { token } = useContext(AuthContext);
  const [locked, setLocked] = useState(false);
  const [form, setForm] = useState({
    storeName: "",
    email: "",
    phone: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolder: "",
    trc20Wallet: "",
  });

  // ✅ Fetch user settings
  useEffect(() => {
    getSettings(token)
      .then((res) => {
        const data = res.data || {};
        setForm({
          storeName: data.storeName || "",
          email: data.email || "",
          phone: data.phone || "",
          bankName: data.bankName || "",
          accountNumber: data.accountNumber || "",
          ifscCode: data.ifscCode || "",
          accountHolder: data.accountHolder || "",
          trc20Wallet: data.trc20Wallet || "",
        });

        // Lock if already filled
        if (data.storeName && data.bankName && data.trc20Wallet) {
          setLocked(true);
        }
      })
      .catch(() => toast.error("Failed to load settings"));
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !form.storeName ||
      !form.email ||
      !form.phone ||
      !form.bankName ||
      !form.accountNumber ||
      !form.ifscCode ||
      !form.accountHolder ||
      !form.trc20Wallet
    ) {
      toast.warn("⚠️ Please fill all fields.");
      return;
    }

    try {
      await updateSettings(token, form);
      toast.success("✅ Settings saved successfully!");
      setLocked(true); // ✅ Show saved info instantly
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update settings.");
    }
  };

  // ✅ Saved settings (read-only view)
  const renderSavedSettings = () => (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-green-600 mb-4">
        Saved Account Information
      </h2>
      <div className="divide-y divide-gray-200">
        {Object.entries(form).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-center py-3 text-sm sm:text-base"
          >
            <span className="text-gray-700 font-medium capitalize">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (s) => s.toUpperCase())}
            </span>
            <span
              className="text-gray-600 truncate max-w-[60%] text-right"
              title={value}
            >
              {value || "-"}
            </span>
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-xs mt-6 italic">
        ⚠️ Settings are locked after first update. Contact support for changes.
      </p>
    </div>
  );

  // ✅ Editable form (only if not locked)
  const renderForm = () => (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { label: "Store Name", name: "storeName", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone Number", name: "phone", type: "text" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-gray-700 font-medium mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>
        ))}

        <h2 className="text-lg font-semibold text-gray-800 mt-6">
          Withdrawal Bank Details
        </h2>

        {[
          { label: "Bank Name", name: "bankName" },
          { label: "Account Number", name: "accountNumber" },
          { label: "IFSC Code", name: "ifscCode" },
          { label: "Account Holder Name", name: "accountHolder" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-gray-700 font-medium mb-1">
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>
        ))}

        <h2 className="text-lg font-semibold text-gray-800 mt-6">
          Crypto Wallet (TRC20)
        </h2>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            TRC20 Wallet Address
          </label>
          <input
            type="text"
            name="trc20Wallet"
            value={form.trc20Wallet}
            onChange={handleChange}
            placeholder="Enter your TRC20 wallet address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition"
        >
          Update Settings
        </button>
      </form>
    </div>
  );

  return (
    <div className="p-6 h-full bg-gray-50">
      <h1 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
        <FaCog className="text-green-500" /> Account Settings
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        ⚠️ You can update your account settings only{" "}
        <span className="font-semibold text-red-500">once</span>. Please make
        sure all details are correct before saving.
      </p>

      {/* Conditional rendering */}
      {locked ? renderSavedSettings() : renderForm()}
    </div>
  );
}
