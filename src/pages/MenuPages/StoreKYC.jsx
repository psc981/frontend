import React, { useState, useEffect, useContext } from "react";
import { FaCheckCircle, FaIdCard } from "react-icons/fa";
import { createKYC, getMyKYC } from "../../api/api";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";

export default function StoreKYC() {
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [kycDetails, setKycDetails] = useState(null);
  const [loadingKYC, setLoadingKYC] = useState(true); // new loading flag
  const { token } = useContext(AuthContext); // This ensures correct token is used

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    idType: "",
    idNumber: "",
    idFront: null,
    idBack: null,
  });

  useEffect(() => {
    const fetchKYC = async () => {
      if (!token) {
        setLoadingKYC(false);
        return;
      }

      try {
        const res = await getMyKYC(token);
        const myKYC = res.data;

        if (!myKYC) {
          setPending(false);
          setVerified(false);
        } else {
          setKycDetails(myKYC);

          switch (myKYC.status) {
            case "pending":
              setPending(true);
              setVerified(false);
              break;
            case "approved":
              setPending(false);
              setVerified(true);
              break;
            case "rejected":
              setPending(false);
              setVerified(false);
              toast.error(
                `❌ Your KYC was rejected. Reason: ${
                  myKYC.rejectionReason || "Not provided"
                }`,
              );
              break;
            default:
              setPending(false);
              setVerified(false);
          }
        }
      } catch (err) {
        console.error("Error fetching KYC:", err);
        setPending(false);
        setVerified(false);
      } finally {
        setLoadingKYC(false);
      }
    };

    fetchKYC();
  }, []);

  // ✅ Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pending || verified) return;

    if (
      !form.name ||
      !form.address ||
      !form.phone ||
      !form.email ||
      !form.idType ||
      !form.idNumber ||
      !form.idFront ||
      !form.idBack
    ) {
      toast.warn("⚠️ Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await createKYC(token, form);
      toast.success("✅ KYC submitted successfully!");
      setPending(true);
    } catch (error) {
      console.error("Error submitting KYC:", error);
      const msg = error.response?.data?.error || "Failed to submit KYC.";
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingKYC) {
    return <Spinner fullScreen={true} />;
  }

  return (
    <div className="p-6 h-full bg-gray-50">
      <h1 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
        <FaCheckCircle className="text-green-500" /> Store KYC Verification
      </h1>

      {/* ⏳ If Pending */}
      {pending && !verified && (
        <div className="bg-white border border-yellow-200 rounded-lg shadow-md p-6 text-center">
          <p className="text-yellow-600 font-semibold text-lg">
            ⏳ Your KYC is under review.
          </p>
          <p className="text-gray-500 mt-2">
            Please wait while our team verifies your submitted details.
          </p>
        </div>
      )}

      {/* ✅ If Verified */}
      {verified && kycDetails && (
        <div className="bg-white shadow-md rounded-lg border border-gray-100 p-6 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
            <FaIdCard className="text-green-500" /> Verified KYC Information
          </h2>

          <div className="divide-y divide-gray-200">
            {[
              ["Full Name", kycDetails.name],
              ["Address", kycDetails.address],
              ["Phone", kycDetails.phone],
              ["Email", kycDetails.email],
              ["ID Type", kycDetails.idType],
              ["ID Number", kycDetails.idNumber],
              [
                "Status",
                <span className="text-green-600 font-semibold">
                  Verified ✅
                </span>,
              ],
            ].map(([label, value], i) => (
              <div key={i} className="flex justify-between py-3">
                <span className="text-gray-600 font-medium">{label}</span>
                <span className="text-gray-800 truncate max-w-xs text-right">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-medium mb-1">ID Front</p>
              <img
                src={kycDetails.idFront}
                alt="ID Front"
                className="rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
            <div>
              <p className="text-gray-600 font-medium mb-1">ID Back</p>
              <img
                src={kycDetails.idBack}
                alt="ID Back"
                className="rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* 🧾 If No KYC Yet */}
      {!pending && !verified && (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Enter your full name"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address (as per ID)
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Enter your address"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            {/* ID Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Identification Type
              </label>
              <select
                name="idType"
                value={form.idType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Select ID Type</option>
                <option value="idCard">ID Card</option>
                <option value="passport">Passport</option>
                <option value="driverLicense">Driver License</option>
              </select>
            </div>

            {/* ID Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Identification Number
              </label>
              <input
                type="text"
                name="idNumber"
                value={form.idNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Enter ID Number"
              />
            </div>

            {/* Uploads */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload ID (Front Side)
              </label>
              <input
                type="file"
                name="idFront"
                accept="image/*,.pdf"
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload ID (Back Side)
              </label>
              <input
                type="file"
                name="idBack"
                accept="image/*,.pdf"
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit KYC"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
