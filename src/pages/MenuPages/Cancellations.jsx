import React, { useEffect, useState, useContext } from "react";
import { FaTimes, FaDollarSign, FaBox, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getMyPurchases } from "../../api/purchaseApi";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";

export default function Cancellations() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getMyPurchases(token);
        // Only keep orders with status "cancelled"
        const cancelledOrders = (res.data.purchases || []).filter(
          (order) => order.status === "cancelled",
        );
        setOrders(cancelledOrders);
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

  return (
    <div className="p-4 min-h-screen bg-white">
      {/* Header */}
      <h1 className="text-3xl font-bold text-green-600 mb-2 flex items-center gap-3">
        <FaTimes className="text-green-500 text-2xl" /> My Cancellations
      </h1>

      <p className="text-gray-400 text-lg mb-8">No items in wishlist yet.</p>

      {loading ? (
        <div className="flex justify-center mt-20">
          <Spinner />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center text-center mt-10">
          <div className="mb-8">
            <img
              src="/My Cancellations.png"
              alt="No cancellations"
              className="w-72 h-72 object-contain"
            />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            No Cancellations Yet
          </h2>
          <p className="text-gray-600 mb-10">
            You haven't cancelled any orders.
          </p>

          <div className="w-full max-w-sm">
            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-md transition duration-300 uppercase tracking-wide"
            >
              View Order History
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4 border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li
                key={order._id}
                className="flex items-center justify-between py-4"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  {order.product?.image ? (
                    <img
                      src={order.product.image}
                      alt={order.product.name}
                      className="w-16 h-16 object-contain rounded-lg border"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg border">
                      <FaBox className="text-2xl text-green-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-gray-800 font-medium">
                      {order.product?.name || "Product"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Cancelled on{" "}
                      {new Date(
                        order.updatedAt || order.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-gray-700 font-semibold">
                    <FaDollarSign className="inline mr-1 text-green-600" />
                    {order.amount}
                  </p>
                  <div className="flex items-center gap-1 text-red-600 text-xs font-semibold mt-1">
                    <FaTimesCircle /> Cancelled
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
