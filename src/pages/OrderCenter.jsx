"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { getMyPurchases, claimProfit } from "../api/purchaseApi";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { releaseBuyerEscrow } from "../api/paymentApi";
import Spinner from "../components/Spinner";

export default function OrderCenter() {
  const [currentPage, setCurrentPage] = useState(1);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(null);
  const [transferring, setTransferring] = useState(null);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [totalPages, setTotalPages] = useState(1);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await getMyPurchases(token, { page: currentPage, limit: 10 });
      setPurchases(res.data.purchases || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [token, currentPage]);

  // Timer to update remaining seconds for all purchases every second
  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const elapsed = now - startOfDay;
  const progress = Math.min(100, (elapsed / (24 * 60 * 60 * 1000)) * 100);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const canClaimProfit = (purchase) => {
    const purchaseTime = new Date(purchase.createdAt);
    const now = new Date();
    const secondsSincePurchase = (now - purchaseTime) / 1000;
    return secondsSincePurchase >= 86400 && purchase.status === "to_be_paid";
  };

  const handleDetailsClick = (purchase) => {
    navigate(`/products/${purchase.product?._id || purchase._id}`, {
      state: { order: purchase.product || purchase },
    });
  };

  const handleTransfer = async (purchase) => {
    setTransferring(purchase._id);
    try {
      if (!purchase.buyerEscrowTransactionId) {
        toast.error("Escrow transaction not found for this order.");
        return;
      }
      const res = await releaseBuyerEscrow(
        token,
        purchase.buyerEscrowTransactionId,
      );
      toast.success(res.data.message || "Funds transferred to your wallet!");
      // Refresh purchases to update transfer button status
      fetchPurchases();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to transfer funds. Try again.",
      );
    } finally {
      setTransferring(null);
    }
  };

  const handleClaimProfit = async (purchaseId) => {
    setClaiming(purchaseId);
    try {
      const res = await claimProfit(token, purchaseId);
      toast.success(res.data.message || "Profit claimed!");
      // Refresh purchases to update status and balance
      fetchPurchases();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to claim profit. Please try again.",
      );
    } finally {
      setClaiming(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-3 w-full">
      <div className="mb-4 bg-white p-4 rounded-lg shadow">
        <h1 className="text-lg font-bold text-gray-800">
          Your store is active!
        </h1>
        <p className="text-sm text-gray-600">
          Your products is selling estimated in{" "}
          <span className="font-bold text-orange-500">24 hour's</span> with{" "}
          <span className="font-bold text-orange-500">3.2% profit</span>.
        </p>
        <div className="mt-4">
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              ></div>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Our algorithm is currently matching your products with interested
          buyers.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {loading ? (
          <Spinner />
        ) : purchases.length === 0 ? (
          <p className="text-gray-500 text-center text-sm">No orders yet.</p>
        ) : (
          purchases.map((purchase) => {
            const purchaseTime = new Date(purchase.createdAt);
            const now = new Date();
            const secondsSincePurchase = (now - purchaseTime) / 1000;
            const remainingSeconds = Math.ceil(86400 - secondsSincePurchase);

            return (
              <div
                key={purchase._id}
                className="bg-white rounded-md shadow-sm border border-gray-200 p-3 sm:p-4 overflow-hidden"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-600 truncate">
                    {purchase._id}
                  </span>
                  <span className="text-xs sm:text-sm text-green-600 font-medium">
                    {purchase.status || "Completed"}
                  </span>
                </div>

                {/* Product Info */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                    <img
                      src={purchase.product?.image || "/placeholder.svg"}
                      alt={purchase.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {purchase.product?.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        ${purchase.product?.price?.toFixed(2)} × 1
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center text-xs sm:text-sm space-x-1 sm:space-x-2">
                  <button
                    onClick={() => handleDetailsClick(purchase)}
                    className="flex-1 py-1 px-2 border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors rounded"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => handleTransfer(purchase)}
                    disabled={
                      purchase.escrowStatus === "approved" ||
                      transferring === purchase._id
                    }
                    className={`flex-1 py-1 px-2 border border-gray-300 font-medium transition-colors rounded ${
                      purchase.escrowStatus === "approved" ||
                      transferring === purchase._id
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {transferring === purchase._id
                      ? "Transferring..."
                      : purchase.escrowStatus === "approved"
                        ? "Transferred"
                        : "Transfer"}
                  </button>

                  {canClaimProfit(purchase) ? (
                    <button
                      onClick={() => handleClaimProfit(purchase._id)}
                      disabled={claiming === purchase._id}
                      className="flex-1 py-1 px-2 bg-green-500 text-white font-medium hover:bg-green-600 transition-colors rounded"
                    >
                      {claiming === purchase._id
                        ? "Claiming..."
                        : "Claim Profit"}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 py-1 px-2 bg-gray-300 text-gray-600 font-medium rounded cursor-not-allowed"
                    >
                      {purchase.status === "paid"
                        ? "Profit Claimed"
                        : `Wait ${
                            remainingSeconds > 0 ? remainingSeconds : 0
                          }s`}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm transition-colors ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Previous
          </button>
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm transition-colors ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
