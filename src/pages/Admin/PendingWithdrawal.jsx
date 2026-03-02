import React, { useEffect, useState, useContext } from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import {
  getAllTransactions,
  approveWithdraw,
  rejectWithdraw,
  deleteTransaction,
} from "../../api/paymentApi";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import Spinner from "../../components/Spinner";

function PendingWithdrawal() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchPendingWithdrawals();
  }, []);

  // ✅ Fetch only withdraw-type transactions with status=pending
  const fetchPendingWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await getAllTransactions(token, "pending", "withdraw");
      const txns = res.data?.transactions || res.transactions || [];

      setWithdrawals(txns);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      toast.error("Failed to fetch withdrawals");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve handler
  const handleApprove = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Approve Withdrawal",
      message: "Are you sure you want to approve this withdrawal request?",
      type: "success",
      onConfirm: async () => {
        try {
          await approveWithdraw(token, id);
          toast.success("Withdrawal approved successfully!");
          fetchPendingWithdrawals();
        } catch (error) {
          console.error("Approve error:", error);
          toast.error("Failed to approve withdrawal");
        }
      },
    });
  };

  // ✅ Reject handler
  const handleReject = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Reject Withdrawal",
      message:
        "Are you sure you want to reject this withdrawal? The amount will be refunded to the user's balance.",
      type: "danger",
      onConfirm: async () => {
        try {
          await rejectWithdraw(token, id);
          toast.info("Withdrawal rejected");
          fetchPendingWithdrawals();
        } catch (error) {
          console.error("Reject error:", error);
          toast.error("Failed to reject withdrawal");
        }
      },
    });
  };

  // ✅ Delete handler
  const handleDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Withdrawal",
      message:
        "Are you sure you want to permanently delete this withdrawal record?",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteTransaction(token, id);
          toast.success("Withdrawal deleted successfully!");
          fetchPendingWithdrawals();
        } catch (error) {
          console.error("Delete error:", error);
          toast.error("Failed to delete withdrawal");
        }
      },
    });
  };

  return (
    <div className="w-full text-black p-4 sm:p-8">
      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
      />
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Pending Withdrawals
      </h2>

      {loading ? (
        <Spinner />
      ) : withdrawals.length === 0 ? (
        <div className="text-gray-300">No pending withdrawals.</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          {/* Scrollable table */}
          <div className="max-h-[400px] overflow-y-auto">
            <table className="min-w-full text-sm text-left text-gray-900">
              <thead className="bg-gray-100 text-gray-900 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3">S.No</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Requested</th>
                  <th className="px-6 py-3">Net Payout</th>
                  <th className="px-6 py-3">Method</th>
                  <th className="px-6 py-3 text-nowrap">Account Name</th>
                  <th className="px-6 py-3 text-nowrap">Account Number</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w, index) => (
                  <tr key={w._id} className="border-b border-gray-200">
                    <td className="px-6 py-3 font-medium">{index + 1}</td>
                    <td className="px-6 py-3 capitalize">
                      {w.user?.name || "N/A"}
                    </td>
                    <td className="px-6 py-3">${w.amount}</td>
                    <td className="px-6 py-3 text-green-600 font-bold">
                      ${w.netAmount || (w.amount * 0.962).toFixed(2)}
                    </td>
                    <td className="px-6 py-3">{w.method || "N/A"}</td>
                    <td className="px-6 py-3">{w.accountName || "N/A"}</td>
                    <td className="px-6 py-3">{w.accountNumber || "N/A"}</td>
                    <td className="px-6 py-3 flex space-x-4">
                      <button
                        onClick={() => handleApprove(w._id)}
                        className="text-green-500 hover:text-green-600"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleReject(w._id)}
                        className="text-red-500 hover:text-red-600"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                      <button
                        onClick={() => handleDelete(w._id)}
                        className="text-gray-800 hover:text-black"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PendingWithdrawal;
