"use client";

import React, { useEffect, useState, useContext } from "react";
import { FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import { getAllPurchases, deletePurchase } from "../../api/purchaseApi";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";

function Table({ orders, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="max-h-[400px] overflow-y-auto">
        <table className="min-w-full text-sm text-left text-gray-900">
          <thead className="bg-gray-100 text-gray-900 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3">S.No</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-center">Claimed</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-6 py-3 font-medium">{index + 1}</td>
                  <td className="px-6 py-3">{order.user?.name || "N/A"}</td>
                  <td className="px-6 py-3">{order.product?.name || "N/A"}</td>
                  <td className="px-6 py-3 font-medium text-green-400">
                    ${order.amount?.toFixed(2)}
                  </td>
                  <td className="px-6 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  {/* ✅ Claimed Icon only */}
                  <td className="px-6 py-3 text-center">
                    {order.paymentClaimedAt ? (
                      <FaCheck className="text-green-500 text-lg" />
                    ) : (
                      <FaTimes className="text-red-500 text-lg" />
                    )}
                  </td>

                  {/* ✅ Action: Bin only */}
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => onDelete(order._id)}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Delete Order"
                    >
                      <FaTrashAlt className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-400 italic"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Orders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch all orders
  const fetchOrders = async (search = "") => {
    setLoading(true);
    try {
      const res = await getAllPurchases(token, search);
      setOrders(res.data.purchases || []);
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (token) {
        fetchOrders(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [token, searchTerm]);

  // ✅ Delete handler
  const handleDeleteOrder = async (id) => {
    try {
      await deletePurchase(token, id);
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) return <Spinner fullScreen={true} />;

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-medium">{error}</p>
    );

  return (
    <div className="flex flex-col justify-start items-center text-black">
      <div className="max-w-7xl w-full space-y-6">
        <h1 className="text-2xl font-semibold mb-4">Orders Overview</h1>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <input
            type="text"
            placeholder="Search orders by customer name, email or product..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <Table orders={orders} onDelete={handleDeleteOrder} />
        )}
      </div>
    </div>
  );
}
