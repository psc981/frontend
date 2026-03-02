import React, { useEffect, useState } from "react";
import { getAllKYC, verifyOrRejectKYC } from "../../api/api";
import { toast } from "react-toastify";

const AdminKYC = () => {
  const [kycRequests, setKycRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("adminToken"); // ✅ Admin token

  // ✅ Fetch all KYC requests
  useEffect(() => {
    const fetchKYC = async () => {
      try {
        setLoading(true);
        const { data } = await getAllKYC(token);
        setKycRequests(data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load KYC requests",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchKYC();
  }, [token]);

  // ✅ Approve KYC
  const handleApprove = async (id) => {
    try {
      await verifyOrRejectKYC(token, id, "approved");
      toast.success("KYC approved successfully");
      setKycRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: "approved" } : req,
        ),
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve KYC");
    }
  };

  // ✅ Reject KYC
  const handleReject = async (id) => {
    try {
      await verifyOrRejectKYC(token, id, "rejected");
      toast.info("KYC rejected");
      setKycRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: "rejected" } : req,
        ),
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject KYC");
    }
  };

  return (
    <div className="text-gray-900">
      <h1 className="text-2xl font-bold text-green-600 mb-6">
        KYC Verification Requests
      </h1>

      {loading ? (
        <div className="text-gray-500">Loading KYC records...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full text-sm text-left text-gray-900">
              <thead className="bg-gray-100 text-gray-900 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">ID Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {kycRequests.length > 0 ? (
                  kycRequests.map((req) => (
                    <tr
                      key={req._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-3">{req._id}</td>
                      <td className="px-6 py-3">{req.name}</td>
                      <td className="px-6 py-3">{req.email}</td>
                      <td className="px-6 py-3">{req.phone}</td>
                      <td className="px-6 py-3">{req.idType}</td>
                      <td
                        className={`px-6 py-3 font-semibold ${
                          req.status === "approved"
                            ? "text-green-600"
                            : req.status === "rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                        }`}
                      >
                        {req.status}
                      </td>
                      <td className="px-6 py-3 flex space-x-3 justify-center">
                        <button
                          onClick={() => handleApprove(req._id)}
                          disabled={req.status !== "pending"}
                          className={`px-4 py-1 rounded-md text-white ${
                            req.status !== "pending"
                              ? "bg-green-900 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req._id)}
                          disabled={req.status !== "pending"}
                          className={`px-4 py-1 rounded-md text-white ${
                            req.status !== "pending"
                              ? "bg-red-900 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4 text-gray-400 italic"
                    >
                      No KYC records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKYC;
