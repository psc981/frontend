import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { buyProduct } from "../api/purchaseApi";
import { AuthContext } from "../context/AuthContext";

export default function OrderModal({ product, onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const { token } = useContext(AuthContext);

  if (!product) return null;

  const handleOrder = async () => {
    setLoading(true);
    toast.info("Processing your order, please wait...");

    try {
      // Call backend API to buy product
      const res = await buyProduct(token, { productId: product._id });
      setOrder(res.data.purchase); // Store backend order data
      toast.success("Order placed successfully!");
      setLoading(false);
      // Optionally: close modal after showing order summary
      setTimeout(() => {
        onClose();
        navigate("/orders");
      }, 1500);
    } catch (err) {
      setLoading(false);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message); // e.g., "Insufficient balance"
      } else {
        toast.error("Order failed. Please try again.");
      }
    }
  };

  // Use backend order ID if available, else show last 6 of product._id
  const orderId = order?._id ? order._id : product._id?.slice(-6);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition"
          disabled={loading}
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Order Summary
        </h2>

        {/* Product Info */}
        <div className="flex flex-col sm:flex-row gap-5 mb-5">
          <img
            src={product.image || "/no-image.png"}
            alt={product.name}
            className="w-28 sm:w-28 h-28 object-contain rounded-lg border bg-gray-50"
          />
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="text-lg font-bold text-green-600">
              ${product.price?.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Charges Breakdown */}
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>VAT Charges</span>
            <span>0%</span>
          </div>
          <div className="flex justify-between">
            <span>Custom Duty</span>
            <span>0%</span>
          </div>
          <div className="flex justify-between">
            <span>Packing Charges</span>
            <span>No</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span>No</span>
          </div>
          <div className="flex justify-between font-medium border-t pt-2">
            <span>Product Price</span>
            <span>${product.price?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>0%</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between mt-5 text-lg font-bold text-gray-900 border-t pt-4">
          <span>Total Payable</span>
          <span>${product.price?.toFixed(2)}</span>
        </div>

        {/* Action Button */}
        {!order ? (
          <button
            onClick={handleOrder}
            disabled={loading}
            className={`w-full mt-6 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white py-3 rounded-lg font-medium text-base transition shadow-md`}
          >
            {loading ? "Processing..." : "Process Order"}
          </button>
        ) : (
          <div className="w-full mt-6 bg-green-100 text-green-800 py-3 rounded-lg font-medium text-base text-center shadow-md">
            Order placed! Redirecting...
          </div>
        )}
      </div>
    </div>
  );
}
