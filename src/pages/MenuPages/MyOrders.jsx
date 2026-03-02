import React, { useEffect, useState, useContext } from "react";
import {
  FaBox,
  FaCalendarAlt,
  FaDollarSign,
  FaShoppingCart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getMyPurchases } from "../../api/purchaseApi";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getMyPurchases(token);
        // Only keep orders with status "paid"
        const paidOrders = (res.data.purchases || []).filter(
          (order) => order.status === "paid",
        );
        setOrders(paidOrders);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  const statusColor = {
    paid: "text-green-600 bg-green-50",
    cancelled: "text-red-600 bg-red-50",
    to_be_paid: "text-yellow-600 bg-yellow-50",
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-green-600 mb-8 flex items-center gap-3">
        <FaShoppingCart className="text-green-500 text-2xl" /> My Orders
      </h1>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center mt-20">
            <Spinner />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-10">
            <div className="mb-8">
              <img
                src="/My Caders.png"
                alt="No orders"
                className="w-72 h-72 object-contain"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              You don't have any paid orders yet.
            </h2>
            <p className="text-gray-500 mb-10 px-4">
              Place your first order to see it here!
            </p>

            <div className="w-full max-w-sm px-2">
              <button
                onClick={() => navigate("/products")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-md transition duration-300 uppercase tracking-wide"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition border border-gray-100"
            >
              {/* Left: Product + ID */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-green-50 rounded-lg">
                  <FaBox className="text-green-600 text-xl" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">
                    {order.product?.name}
                  </h2>
                  <p className="text-xs text-gray-400">
                    ID: {order._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Middle: Date + Total */}
              <div className="flex flex-row items-center justify-between sm:justify-start gap-6 text-sm">
                <div className="flex items-center gap-1 text-gray-500">
                  <FaCalendarAlt className="text-gray-400" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1 text-gray-800 font-bold">
                  <FaDollarSign className="text-green-600" />
                  {order.amount}
                </div>
              </div>

              {/* Right: Status */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    statusColor[order.status]
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
