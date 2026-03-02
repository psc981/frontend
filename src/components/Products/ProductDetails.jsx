"use client";

import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMyPurchases } from "../../api/purchaseApi";
import {
  FaBox,
  FaCreditCard,
  FaPlane,
  FaCheckCircle,
  FaInfoCircle,
  FaTruck,
  FaDollarSign,
  FaProjectDiagram,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "../Spinner";

export default function ProductDetails() {
  const { id } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchPurchase = async () => {
      setLoading(true);
      try {
        const res = await getMyPurchases(token);
        const found = res.data.purchases.find((p) => p.product?._id === id);
        setPurchase(found || null);
      } catch (err) {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchPurchase();
  }, [id, token]);

  if (loading) return <Spinner fullScreen={true} />;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!purchase || !purchase.product)
    return <p className="text-center mt-10">Order not found.</p>;

  const { product, createdAt, paymentClaimedAt, amount } = purchase;

  return (
    <div className="p-6 min-h-screen w-full">
      {/* --- Upper Card --- */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        {/* --- Order Timeline --- */}
        <div className="space-y-6">
          {/* Order Placed */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white">
              <FaBox size={14} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Order Placed</p>
              <p className="text-xs text-gray-500">
                {createdAt ? new Date(createdAt).toLocaleString() : "N/A"}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white">
              <FaCreditCard size={14} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Payment</p>
              <p className="text-xs text-green-600">Completed</p>
            </div>
          </div>

          {/* Consignment */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white">
              <FaPlane size={14} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Consignment</p>
              <p className="text-xs text-gray-400">
                Estimated to arrive in 2-3 days
              </p>
            </div>
          </div>

          {/* Confirm Receipt */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
              <FaCheckCircle size={14} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">
                Confirm Receipt
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* --- Product Section --- */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Product</h2>
          <div className="flex items-center gap-4">
            <img
              src={
                product.image ||
                "https://via.placeholder.com/150x150.png?text=No+Image"
              }
              alt={product.name}
              className="w-24 h-24 object-contain rounded-lg border"
            />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500">{product.category}</p>
              <p className="text-green-600 font-semibold">
                ${product.price?.toFixed(2)} × 1
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-1 text-sm text-gray-700">
            <p className="flex justify-between">
              <span>Total order price</span>
              <span>${product.price?.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Payment amount</span>
              <span className="text-green-600">
                ${amount?.toFixed(2) || product.price?.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* --- Additional Info Cards Below --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Product Overview */}
        <div className="bg-white shadow-md rounded-lg p-4 space-y-2 border border-gray-200">
          <div className="flex items-center gap-2">
            <FaInfoCircle className="text-green-600" />
            <h3 className="text-md font-semibold text-gray-900">
              Product Overview
            </h3>
          </div>
          <p className="text-sm text-gray-700">
            This product, <span className="font-semibold">{product.name}</span>,
            belongs to the{" "}
            <span className="text-green-600 font-medium">
              {product.category}
            </span>{" "}
            category. It offers excellent quality and is highly rated by our
            customers.
          </p>
        </div>

        {/* Consignment Details */}
        <div className="bg-white shadow-md rounded-lg p-4 space-y-2 border border-gray-200">
          <div className="flex items-center gap-2">
            <FaTruck className="text-green-600" />
            <h3 className="text-md font-semibold text-gray-900">
              Consignment & Shipping
            </h3>
          </div>
          <p className="text-sm text-gray-700">
            Your order was placed on{" "}
            <span className="font-semibold">
              {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
            </span>{" "}
            and has been processed for shipping. Estimated delivery is within{" "}
            <span className="text-green-600 font-medium">2-3 days</span>.
          </p>
        </div>

        {/* Payment Flow */}
        <div className="bg-white shadow-md rounded-lg p-4 space-y-2 border border-gray-200">
          <div className="flex items-center gap-2">
            <FaDollarSign className="text-green-600" />
            <h3 className="text-md font-semibold text-gray-900">
              Payment Flow
            </h3>
          </div>
          <p className="text-sm text-gray-700">
            Payment was successfully processed automatically from your wallet.
            Amount charged:{" "}
            <span className="text-green-600 font-medium">
              ${amount?.toFixed(2) || product.price?.toFixed(2)}
            </span>
            . No further action is required.
          </p>
        </div>

        {/* Overall Order Process */}
        <div className="bg-white shadow-md rounded-lg p-4 space-y-2 border border-gray-200">
          <div className="flex items-center gap-2">
            <FaProjectDiagram className="text-green-600" />
            <h3 className="text-md font-semibold text-gray-900">
              Order Process
            </h3>
          </div>
          <p className="text-sm text-gray-700">
            Your order follows a smooth flow:{" "}
            <span className="font-semibold">
              Order Placed → Payment Completed → Consignment → Confirm Receipt
            </span>
            . You can track each step in the timeline above. Once received,
            confirm receipt to complete the process.
          </p>
        </div>
      </div>
    </div>
  );
}
