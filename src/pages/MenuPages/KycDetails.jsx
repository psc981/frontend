import React, { useEffect, useState } from "react";
import { getAllKYC } from "../../api/api"; // ✅ import service
import { FaIdCard, FaEnvelope, FaPhoneAlt, FaHome } from "react-icons/fa";

function KycDetails() {
  const [kyc, setKyc] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchKYC = async () => {
      try {
        const response = await getAllKYC(token);
        // Assuming latest submitted KYC is last in array
        const latest = response.data[response.data.length - 1];
        setKyc(latest);
      } catch (err) {
        console.error("Error fetching KYC:", err);
      }
    };
    fetchKYC();
  }, [token]);

  if (!kyc) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-green-600 font-semibold">Loading KYC details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg border border-green-100 w-full max-w-3xl p-8">
        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
          KYC Verification Details
        </h1>

        {/* Status */}
        <div className="flex justify-center mb-6">
          <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
            Pending ⏳
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h2 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
              <FaIdCard /> Personal Info
            </h2>
            <p>
              <strong>Name:</strong> {kyc.name}
            </p>
            <p>
              <strong>Email:</strong> {kyc.email}
            </p>
            <p>
              <strong>Phone:</strong> {kyc.phone}
            </p>
            <p>
              <strong>Address:</strong> {kyc.address}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h2 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
              <FaIdCard /> Identification
            </h2>
            <p>
              <strong>ID Type:</strong> {kyc.idType}
            </p>
            <p>
              <strong>ID Number:</strong> {kyc.idNumber}
            </p>
          </div>
        </div>

        {/* Uploaded Docs */}
        <div className="mt-6">
          <h2 className="font-semibold text-green-700 mb-3">
            Uploaded Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kyc.idFront && (
              <div className="bg-white border rounded-lg shadow-sm p-2">
                <p className="text-sm text-gray-600 mb-1">Front Side</p>
                <img
                  src={kyc.idFront}
                  alt="ID Front"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              </div>
            )}
            {kyc.idBack && (
              <div className="bg-white border rounded-lg shadow-sm p-2">
                <p className="text-sm text-gray-600 mb-1">Back Side</p>
                <img
                  src={kyc.idBack}
                  alt="ID Back"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KycDetails;
