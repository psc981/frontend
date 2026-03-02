import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import {
  getPendingTransactions,
  approveDeposit,
  rejectDeposit,
  deleteTransaction,
} from "../../api/paymentApi";
import { AuthContext } from "../../context/AuthContext";
import ConfirmationModal from "../../components/ConfirmationModal";
import Spinner from "../../components/Spinner";

function PendingDeposit() {
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const [editAmounts, setEditAmounts] = useState({}); // { [id]: value }

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    onConfirm: () => {},
  });

  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      try {
        const res = await getPendingTransactions(token, "deposit");
        const txns = res.data?.transactions || res.transactions || [];
        setPendingDeposits(txns);
      } catch (err) {
        toast.error("Failed to fetch pending deposits");
      }
      setLoading(false);
    };
    fetchPending();
  }, [token]);

  const handleApprove = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Approve Deposit",
      message: "Are you sure you want to approve this deposit request?",
      type: "success",
      onConfirm: async () => {
        try {
          const editedAmount = editAmounts[id];
          await approveDeposit(
            token,
            id,
            editedAmount !== undefined ? Number(editedAmount) : undefined,
          );
          setPendingDeposits((prev) => prev.filter((t) => t._id !== id));
          toast.success("Deposit approved!");
        } catch (err) {
          toast.error("Failed to approve deposit");
        }
      },
    });
  };

  const handleReject = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Reject Deposit",
      message: "Are you sure you want to reject this deposit?",
      type: "danger",
      onConfirm: async () => {
        try {
          await rejectDeposit(token, id);
          setPendingDeposits((prev) => prev.filter((t) => t._id !== id));
          toast.info("Deposit rejected!");
        } catch (err) {
          toast.error("Failed to reject deposit");
        }
      },
    });
  };

  const handleDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Deposit",
      message:
        "Are you sure you want to permanently delete this deposit record?",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteTransaction(token, id);
          setPendingDeposits((prev) => prev.filter((t) => t._id !== id));
          toast.success("Deposit deleted!");
        } catch (err) {
          toast.error("Failed to delete deposit");
        }
      },
    });
  };

  return (
    <div className="text-black w-full">
      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
      />
      <h2 className="text-2xl font-bold mb-6">Pending Deposits</h2>
      {loading ? (
        <Spinner />
      ) : pendingDeposits.length === 0 ? (
        <div>No pending deposits.</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
            <table className="min-w-full table-auto text-sm text-left text-gray-900">
              <thead className="bg-gray-100 text-gray-900 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 min-w-[80px]">S.No</th>
                  <th className="px-4 py-3 min-w-[120px]">User</th>
                  <th className="px-4 py-3 min-w-[100px]">Amount</th>
                  <th className="px-4 py-3 min-w-[100px]">Method</th>
                  <th className="px-4 py-3 min-w-[150px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDeposits.map((dep, index) => (
                  <tr key={dep._id} className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium">{index + 1}</td>
                    <td className="px-4 py-3">{dep.user?.name || dep.user}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="1"
                        value={
                          editAmounts[dep._id] !== undefined
                            ? editAmounts[dep._id]
                            : dep.amount
                        }
                        onChange={(e) =>
                          setEditAmounts((prev) => ({
                            ...prev,
                            [dep._id]: e.target.value,
                          }))
                        }
                        className="w-24 px-2 py-1 rounded bg-gray-100 text-gray-900 border border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">{dep.method}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleApprove(dep._id)}
                        className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(dep._id)}
                        className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleDelete(dep._id)}
                        className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-black transition-colors"
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

export default PendingDeposit;
