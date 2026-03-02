"use client";

// src/components/WalletSummary.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getWallet } from "../api/api";

export default function WalletSummary() {
  const { token } = useContext(AuthContext);
  const [wallet, setWallet] = useState({ balance: 0 });

  useEffect(() => {
    if (token) {
      getWallet(token)
        .then((res) => setWallet(res.data))
        .catch((err) => console.error(err));
    }
  }, [token]);

  return (
    <div className="bg-white shadow p-4 rounded flex justify-between w-full max-w-md">
      <div>
        <h2 className="font-bold">Wallet Balance</h2>
        <p>{wallet.balance} USDT</p>
      </div>
      <div>
        <h2 className="font-bold">Deposits</h2>
        <p>{wallet.deposits || 0} USDT</p>
      </div>
      <div>
        <h2 className="font-bold">Withdrawals</h2>
        <p>{wallet.withdrawals || 0} USDT</p>
      </div>
    </div>
  );
}
