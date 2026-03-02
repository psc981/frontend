import { useState, useContext } from "react";
import { createDeposit } from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function DepositForm() {
  const { token } = useContext(AuthContext);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("TRC20");
  const [depositInfo, setDepositInfo] = useState(null);
  const [error, setError] = useState("");

  const handleDeposit = async () => {
    if (!amount) return setError("Please enter an amount");
    try {
      const res = await createDeposit({ amount, currency }, token);
      setDepositInfo(res.data.deposit);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Deposit failed");
      setDepositInfo(null);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-2 border-green-600">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Deposit USDT
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center font-medium">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="px-4 py-3 border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 font-medium"
          />

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-4 py-3 border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 font-medium"
          >
            <option value="TRC20">TRC20</option>
            <option value="ERC20">ERC20</option>
            <option value="USDT">USDT</option>
          </select>

          <button
            onClick={handleDeposit}
            className="bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-all"
          >
            Create Deposit
          </button>
        </div>

        {depositInfo && (
          <div className="mt-6 bg-green-50 p-5 rounded-lg border-2 border-green-600 font-medium">
            <p>
              <span className="font-bold">Amount:</span> {depositInfo.amount}{" "}
              {depositInfo.currency}
            </p>
            <p>
              <span className="font-bold">Send to:</span> {depositInfo.address}
            </p>
            <p>
              <span className="font-bold">Invoice ID:</span>{" "}
              {depositInfo.invoiceId}
            </p>
            <p className="mt-2 text-green-700 text-sm">
              Send the exact amount to the above address to complete your
              deposit.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
