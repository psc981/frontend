"use client";

import { useContext, useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { FaMoneyBillWave } from "react-icons/fa";
import { PiHandDepositFill } from "react-icons/pi";
import { MdAccountBalance } from "react-icons/md";
import BottomNavigation from "../components/BottomNavigation";
import PaymentConfirmationModal from "../pages/PaymentConfirmation";
import PaymentQRCode from "./PaymentQRCode";
import WithdrawModal from "../components/WithdrawModal"; // <-- import your new modal
import { AuthContext } from "../context/AuthContext";
import { getMyTransactions } from "../api/paymentApi";
import { initDeposit } from "../api/deposit";
import { createNowPayment } from "../api/nowpaymentsApi";
import { createSafepayTracker } from "../api/safepayApi";
import { getMyPurchases } from "../api/purchaseApi";
import Spinner from "../components/Spinner";
import SocialLinksModal from "../components/SocialLinksModal";

export default function Wallet() {
  const { user, token, setUser } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("account");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false); // <-- new
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [currentOrderNumber, setCurrentOrderNumber] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [withdrawableBalance, setWithdrawableBalance] = useState(0);
  const [isRestricted, setIsRestricted] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEscrow, setTotalEscrow] = useState(0);
  const [showSocialModal, setShowSocialModal] = useState(false);

  const fetchBaseData = async () => {
    setLoading(true);
    try {
      const res = await getMyTransactions(token, { tab: activeTab, page: 1 });

      if (res.data.user) {
        if (typeof res.data.user.balance === "number") {
          setUserBalance(res.data.user.balance);
        }
        setUser((prev) => ({ ...prev, ...res.data.user }));
      }

      setWithdrawableBalance(res.data.withdrawableBalance ?? 0);
      setIsRestricted(res.data.isRestricted ?? false);
      setTotalEscrow(res.data.totalEscrow || 0);

      if (Array.isArray(res.data.transactions)) {
        setTransactions(res.data.transactions);
        setTotalPages(res.data.totalPages || 1);
        setCurrentPage(res.data.currentPage || 1);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaseData();
    setShowSocialModal(true);
  }, [token]);

  useEffect(() => {
    // Only fetch tab specific data when tab or page changes (and not initial loading)
    if (loading) return;

    const fetchTabData = async () => {
      setTabLoading(true);
      try {
        const res = await getMyTransactions(token, {
          tab: activeTab,
          page: currentPage,
        });

        if (Array.isArray(res.data.transactions)) {
          setTransactions(res.data.transactions);
          setTotalPages(res.data.totalPages || 1);
          setTotalEscrow(res.data.totalEscrow || 0);
        }
      } catch (err) {
        console.error("Failed to fetch tab data", err);
      } finally {
        setTabLoading(false);
      }
    };
    fetchTabData();
  }, [activeTab, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const combinedHistory = useMemo(() => {
    const history = [];
    transactions.forEach((txn) => {
      history.push({
        id: txn._id,
        date: txn.createdAt,
        type: txn.type,
        amount: txn.amount,
        description: txn.description || txn.method || "Transaction",
        status: txn.status,
        direction: txn.direction,
        method: txn.method,
        orderId: txn.orderId,
        accountName: txn.accountName,
        accountNumber: txn.accountNumber,
        fee: txn.fee,
        netAmount: txn.netAmount,
      });
    });
    return history.sort(
      (a, b) => new Date(b.date || 0) - new Date(a.date || 0),
    );
  }, [transactions]);

  const getBorderClass = (type) => {
    return "border-green-600";
  };

  const getDotClass = (type) => {
    return "bg-green-500";
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "deposit_bonus_self":
      case "bonus":
        return "Bonus";
      case "daily_profit":
      case "profit":
        return "Profit";
      case "referral_recharge_bonus":
        return "Referral Recharge Bonus";
      case "team_commission":
        return "Team Commission";
      case "referral_bonus":
        return "Commission";
      case "deposit":
        return "Deposit";
      case "withdraw":
        return "Withdrawal";
      case "transfer":
        return "Funds Release";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const handleDeposit = () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      toast.warning("Please enter a valid amount");
      return;
    }

    const orderNumber = generateOrderNumber();
    setCurrentOrderNumber(orderNumber);
    setShowDepositModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    setDepositAmount("");
  };

  const handleConfirmPayment = async (selectedPayment) => {
    try {
      let pay_currency = "";
      if (selectedPayment === "trc20") {
        pay_currency = "usdttrc20";
      } else if (selectedPayment === "bep20") {
        pay_currency = "usdtbsc";
      } else if (selectedPayment === "trx") {
        pay_currency = "trx";
      } else if (
        selectedPayment === "easypaisa" ||
        selectedPayment === "jazzcash"
      ) {
        // WPAY Integration (Reusing Safepay Tracker call)
        const res = await createSafepayTracker(token, {
          amount: depositAmount,
          method: selectedPayment,
        });

        if (res.data.success && res.data.redirectUrl) {
          window.location.href = res.data.redirectUrl;
          return;
        } else {
          toast.error("Failed to create Payment session");
          return;
        }
      } else if (selectedPayment === "card") {
        toast.info("Card payments are not implemented yet.");
        return;
      } else {
        toast.error("Please select a valid payment method.");
        return;
      }

      // Initiate automated payment via NOWPayments based on selection
      const res = await createNowPayment(token, {
        amount: depositAmount,
        pay_currency,
      });

      if (res.data.success) {
        const paymentData = res.data.data;
        if (paymentData.invoice_url) {
          // Redirect to NOWPayments invoice page if available
          window.location.href = paymentData.invoice_url;
        } else if (paymentData.pay_address) {
          // Show QR code for direct payment if address is provided
          setPaymentDetails({
            amount: depositAmount,
            orderNumber: paymentData.order_id,
            address: paymentData.pay_address,
            network: selectedPayment.toUpperCase(), // Store selected network
          });
          setShowPaymentModal(false);
          setShowQRCode(true);
        }
      } else {
        toast.error("Failed to create payment request via NOWPayments.");
      }
    } catch (err) {
      console.error("Payment confirmation error:", err);
      toast.error(
        "An error occurred while processing your payment. Please try again.",
      );
    }
  };

  const generateOrderNumber = () => {
    return `${new Date().getFullYear()}${String(
      new Date().getMonth() + 1,
    ).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}${String(
      new Date().getHours(),
    ).padStart(2, "0")}${String(new Date().getMinutes()).padStart(
      2,
      "0",
    )}${String(new Date().getSeconds()).padStart(2, "0")}${Math.floor(
      Math.random() * 10000,
    )}`;
  };

  const handleQRCodeClose = () => {
    setShowQRCode(false);
    setDepositAmount("");
    setCurrentOrderNumber("");
    setPaymentDetails({});
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow pb-20 w-full max-w-full mx-auto">
        {/* My Assets Section */}
        <div className="bg-green-500 rounded-3xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <MdAccountBalance className="mr-2 text-white" /> My Assets
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6 text-white text-center">
            <div>
              <div className="text-lg font-bold">${userBalance.toFixed(2)}</div>
              <div className="text-[10px] uppercase opacity-80">
                Available amount
              </div>
            </div>
            <div>
              <div className="text-lg font-bold">
                ${withdrawableBalance.toFixed(2)}
              </div>
              <div className="text-[10px] uppercase opacity-80">
                Store Income
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowDepositModal(true)}
              className="flex items-center justify-center bg-white rounded-lg text-black font-semibold py-3 px-4 transition-colors"
            >
              <PiHandDepositFill className="mr-2" /> Deposit
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)} // <-- open withdraw modal
              className="flex items-center justify-center bg-white rounded-lg text-black font-semibold py-3 px-4 transition-colors"
            >
              <FaMoneyBillWave className="mr-2" /> Withdrawal
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            {["account", "deposit", "withdrawal"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === tab
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "account"
                  ? "Account details"
                  : tab === "deposit"
                    ? "Deposit record"
                    : "Cash withdrawal records"}
              </button>
            ))}
          </div>

          <div className="p-4 flex flex-col space-y-6">
            {loading ? (
              <Spinner />
            ) : (
              <>
                {tabLoading ? (
                  <Spinner />
                ) : (
                  <>
                    {activeTab === "account" && (
                      <>
                        {/* Transaction History */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Transaction History
                          </h3>
                          {combinedHistory.length === 0 ? (
                            <div className="text-center text-gray-500">
                              No transactions yet
                            </div>
                          ) : (
                            combinedHistory.map((item) => (
                              <div
                                key={item.id}
                                className={`bg-white rounded-lg shadow-md border-l-4 p-4 mb-4 ${getBorderClass(item.type)}`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <div
                                      className={`w-3 h-3 rounded-full mr-3 ${getDotClass(item.type)}`}
                                    ></div>
                                    <span className="text-sm text-gray-600">
                                      {getTypeLabel(item.type)}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {item.date
                                      ? new Date(item.date).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                </div>
                                <div className="ml-0 md:ml-4">
                                  <div className="text-lg font-bold mb-1 text-gray-900">
                                    {item.type === "withdraw" ? "-" : "+"}$
                                    {item.amount?.toFixed(2) || "0.00"}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {item.description}
                                  </div>
                                  {item.type === "withdraw" && (
                                    <>
                                      <div className="text-sm text-gray-600">
                                        Fee: $
                                        {item.fee ||
                                          (item.amount * 0.038).toFixed(2)}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        Net: $
                                        {(
                                          item.netAmount ||
                                          item.amount -
                                            (item.fee || item.amount * 0.038)
                                        ).toFixed(2)}
                                      </div>
                                      {item.accountName && (
                                        <div className="text-sm text-gray-600">
                                          Account: {item.accountName}
                                        </div>
                                      )}
                                      {item.accountNumber && (
                                        <div className="text-sm text-gray-600">
                                          Number: {item.accountNumber}
                                        </div>
                                      )}
                                    </>
                                  )}
                                  {item.type === "deposit" && (
                                    <>
                                      {item.method && (
                                        <div className="text-sm text-gray-600">
                                          Method: {item.method}
                                        </div>
                                      )}
                                      {item.orderId && (
                                        <div className="text-sm text-gray-600">
                                          Order ID: {item.orderId}
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </>
                    )}

                    {activeTab === "deposit" && (
                      <>
                        {transactions.filter(
                          (txn) => txn.type?.toLowerCase() === "deposit",
                        ).length === 0 ? (
                          <div className="text-center text-gray-500">
                            No deposit records yet
                          </div>
                        ) : (
                          transactions
                            .filter(
                              (txn) => txn.type?.toLowerCase() === "deposit",
                            )
                            .map((txn) => (
                              <div
                                key={txn._id}
                                className={`bg-white rounded-lg shadow-md border-l-4 p-4 ${
                                  txn.status === "approved"
                                    ? "border-green-500"
                                    : txn.status === "rejected"
                                      ? "border-red-500"
                                      : "border-yellow-500"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <div
                                      className={`w-3 h-3 rounded-full mr-3 ${
                                        txn.status === "approved"
                                          ? "bg-green-500"
                                          : txn.status === "rejected"
                                            ? "bg-red-500"
                                            : "bg-yellow-500"
                                      }`}
                                    ></div>
                                    <span className="text-sm text-gray-600">
                                      {txn.type}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {txn.createdAt
                                      ? new Date(
                                          txn.createdAt,
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                </div>

                                <div className="ml-0 md:ml-4">
                                  <div
                                    className={`text-lg font-bold mb-1 ${
                                      txn.status === "approved"
                                        ? "text-green-600"
                                        : txn.status === "rejected"
                                          ? "text-red-600"
                                          : "text-yellow-600"
                                    }`}
                                  >
                                    {(txn.status || "pending")
                                      .charAt(0)
                                      .toUpperCase() +
                                      (txn.status || "pending").slice(1)}
                                  </div>
                                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Operation amount</span>
                                    <span
                                      className={
                                        (txn.amount || 0) < 0
                                          ? "text-red-500"
                                          : "text-green-500"
                                      }
                                    >
                                      {(txn.amount || 0) >= 0 ? "+" : ""}
                                      {txn.amount || 0}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Method</span>
                                    <span>{txn.method || "N/A"}</span>
                                  </div>
                                  {txn.orderId && (
                                    <div className="flex justify-between text-sm text-gray-600">
                                      <span>Order ID</span>
                                      <span className="text-xs">
                                        {txn.orderId}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                        )}
                      </>
                    )}

                    {activeTab === "withdrawal" && (
                      <>
                        {transactions.filter(
                          (txn) => txn.type?.toLowerCase() === "withdraw",
                        ).length === 0 ? (
                          <div className="text-center text-gray-500">
                            No withdrawal records yet
                          </div>
                        ) : (
                          transactions
                            .filter(
                              (txn) => txn.type?.toLowerCase() === "withdraw",
                            )
                            .map((txn) => (
                              <div
                                key={txn._id}
                                className={`bg-white rounded-lg shadow-md border-l-4 p-4 ${
                                  txn.status === "approved"
                                    ? "border-green-500"
                                    : txn.status === "rejected"
                                      ? "border-red-500"
                                      : "border-yellow-500"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <div
                                      className={`w-3 h-3 rounded-full mr-3 ${
                                        txn.status === "approved"
                                          ? "bg-green-500"
                                          : txn.status === "rejected"
                                            ? "bg-red-500"
                                            : "bg-yellow-500"
                                      }`}
                                    ></div>
                                    <span className="text-sm text-gray-600">
                                      {txn.method || "N/A"}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {txn.createdAt
                                      ? new Date(
                                          txn.createdAt,
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                </div>

                                <div className="ml-0 md:ml-4">
                                  <div
                                    className={`text-lg font-bold mb-1 ${
                                      txn.status === "approved"
                                        ? "text-green-600"
                                        : txn.status === "rejected"
                                          ? "text-red-600"
                                          : "text-yellow-600"
                                    }`}
                                  >
                                    {(txn.status || "pending")
                                      .charAt(0)
                                      .toUpperCase() +
                                      (txn.status || "pending").slice(1)}
                                  </div>

                                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Requested amount</span>
                                    <span className="text-red-500">
                                      - ${txn.amount || 0}
                                    </span>
                                  </div>

                                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Fee (3.8%)</span>
                                    <span className="text-red-400">
                                      - $
                                      {txn.fee ||
                                        (txn.amount * 0.038).toFixed(2)}
                                    </span>
                                  </div>

                                  <div className="flex justify-between text-sm font-semibold text-gray-900 mb-1 border-t border-gray-100 pt-1">
                                    <span>Expected Payout</span>
                                    <span className="text-green-600">
                                      $
                                      {txn.netAmount ||
                                        (
                                          txn.amount -
                                          (txn.fee || txn.amount * 0.038)
                                        ).toFixed(2)}
                                    </span>
                                  </div>

                                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Account Name</span>
                                    <span>{txn.accountName || "N/A"}</span>
                                  </div>

                                  <div className="flex justify-between text-sm text-gray-600">
                                    <span>Account Number</span>
                                    <span>{txn.accountNumber || "N/A"}</span>
                                  </div>
                                </div>
                              </div>
                            ))
                        )}
                      </>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-4 mt-6">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((p) => p - 1)}
                          className={`px-4 py-2 rounded-md ${
                            currentPage === 1
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                        >
                          Previous
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                          Account {currentPage} of {totalPages}
                        </span>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((p) => p + 1)}
                          className={`px-4 py-2 rounded-md ${
                            currentPage === totalPages
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 w-96 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Deposit Amount</h2>
            <div className="flex items-center mb-4 border px-3 py-2">
              <span className="mr-2 text-gray-500">$</span>
              <input
                type="number"
                placeholder="Enter recharge amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full outline-none text-gray-900"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[30, 100, 200, 500, 1000, 5000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDepositAmount(amt)}
                  className={`px-2 py-2 border rounded-md font-semibold transition-all ${
                    depositAmount == amt
                      ? "bg-green-600 text-white border-green-600"
                      : "border-green-500 text-green-500 bg-white hover:bg-green-50"
                  }`}
                >
                  {amt.toLocaleString()}
                </button>
              ))}
            </div>
            <button
              onClick={handleDeposit}
              className="w-full bg-green-500 text-white rounded-md font-semibold py-2 transition-colors hover:bg-green-600"
            >
              Deposit
            </button>
            <button
              onClick={() => setShowDepositModal(false)}
              className="mt-2 w-full bg-gray-200 text-gray-700 rounded-md font-semibold py-2 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <WithdrawModal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={() => {
            setShowWithdrawModal(false);
            fetchBaseData(); // Refresh records after successful withdrawal request
          }}
          withdrawableBalance={withdrawableBalance}
          isRestricted={isRestricted}
        />
      )}

      {/* Payment Confirmation Modal */}
      <PaymentConfirmationModal
        isOpen={showPaymentModal}
        onClose={handlePaymentModalClose}
        amount={depositAmount}
        onConfirm={handleConfirmPayment}
        orderNumber={currentOrderNumber}
      />

      {/* Payment QR Code Modal */}
      {showQRCode && (
        <PaymentQRCode
          amount={paymentDetails.amount}
          orderNumber={paymentDetails.orderNumber}
          address={paymentDetails.address}
          network={paymentDetails.network}
          onClose={handleQRCodeClose}
        />
      )}

      {/* Social Links Popup */}
      <SocialLinksModal
        isOpen={showSocialModal}
        onClose={() => setShowSocialModal(false)}
      />

      <BottomNavigation />
    </div>
  );
}
