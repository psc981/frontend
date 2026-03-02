import React, { useContext, useEffect, useState } from "react";
import { getAllTransactions } from "../../api/paymentApi";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";

export default function RechargeHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await getAllTransactions(token);

        // ✅ Show only approved deposits
        const approvedDeposits = (res.transactions || []).filter(
          (tx) => tx.status === "approved" && tx.type === "deposit",
        );

        setTransactions(approvedDeposits);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [token]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold text-green-600 mb-4">
        Approved Deposit History
      </h2>

      {/* Scrollable Table */}
      <div className="max-h-[400px] overflow-y-auto">
        <table className="min-w-full text-sm text-left text-gray-900">
          <thead className="bg-gray-100 text-gray-900 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3">S.No</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
                  <Spinner />
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-6 text-center font-semibold text-gray-900 bg-white"
                >
                  No approved deposit transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx, idx) => (
                <tr
                  key={tx._id || idx}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-3 font-medium">{idx + 1}</td>
                  <td className="px-6 py-3">
                    {tx.user?.name || tx.user || "N/A"}
                  </td>
                  <td className="px-6 py-3 capitalize">{tx.type}</td>
                  <td className="px-6 py-3">${tx.amount}</td>
                  <td className="px-6 py-3 text-green-600 font-semibold">
                    {tx.status}
                  </td>
                  <td className="px-6 py-3">
                    {tx.createdAt
                      ? new Date(tx.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
