import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUsers,
  deleteUser,
  updateUserStatus,
  addBalanceToUser,
} from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";

function Userdetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) {
          setError("No token found. Please login.");
          setLoading(false);
          return;
        }
        const res = await getUsers(token);
        const found = res.data.users.find((u) => u._id === id);
        if (found) setUser(found);
        else setError("User not found");
      } catch (err) {
        setError("Error fetching user");
      }
      setLoading(false);
    };
    fetchUser();
  }, [id, token]);

  const handleStatusChange = async (status) => {
    setActionLoading(true);
    setError("");
    try {
      await updateUserStatus(token, id, status);
      setUser((prev) => ({
        ...prev,
        accountStatus: status,
        isVerified: status === "active",
      }));
    } catch (err) {
      setError("Failed to update status");
    }
    setActionLoading(false);
  };

  const handleAddBalance = async () => {
    if (!addAmount || isNaN(addAmount) || Number(addAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setActionLoading(true);
    try {
      await addBalanceToUser(token, id, addAmount);
      setUser((prev) => ({
        ...prev,
        balance: (prev.balance || 0) + Number(addAmount),
        balances: {
          ...prev.balances,
          recharge: (prev.balances?.recharge || 0) + Number(addAmount),
        },
      }));
      setAddAmount("");
      toast.success("Balance added successfully!");
    } catch (err) {
      toast.error("Failed to add balance");
    }
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setActionLoading(true);
    setError("");
    try {
      await deleteUser(token, id);
      navigate("/psc/users");
    } catch (err) {
      setError("Failed to delete user");
    }
    setActionLoading(false);
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-200">
        <Spinner fullScreen={true} />
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-10 text-red-400 font-medium">{error}</div>
    );

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto mt-12 bg-gray-800 rounded-2xl shadow-lg p-8 text-gray-100 border border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-green-400 border-b border-green-400 pb-2 break-words text-center sm:text-2xl text-xl">
        User Details
      </h2>

      <div className="space-y-3 text-gray-200">
        <div className="break-all">
          <span className="font-semibold text-green-300">User ID:</span>{" "}
          <span className="break-all">{user._id}</span>
        </div>
        <div className="break-all">
          <span className="font-semibold text-green-300">Username:</span>{" "}
          <span className="break-all">{user.name}</span>
        </div>
        <div className="break-all">
          <span className="font-semibold text-green-300">Full Name:</span>{" "}
          <span className="break-all">{user.fullName || user.name}</span>
        </div>
        <div className="break-all">
          <span className="font-semibold text-green-300">Email:</span>{" "}
          <span className="break-all">{user.email || "N/A"}</span>
        </div>
        <div className="break-all">
          <span className="font-semibold text-green-300">Phone:</span>{" "}
          <span className="break-all">{user.phone || "N/A"}</span>
        </div>
        <div>
          <span className="font-semibold text-green-300">Total Balance:</span> $
          {user.balance ?? 0}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-700 p-3 rounded-lg text-sm border border-gray-600">
          <div>
            <span className="text-gray-400">Recharge:</span>
            <span className="ml-1 text-green-300">
              ${user.balances?.recharge ?? 0}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Profit:</span>
            <span className="ml-1 text-green-300">
              ${user.balances?.profit ?? 0}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Referral:</span>
            <span className="ml-1 text-green-300">
              ${user.balances?.referralBonus ?? 0}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Team:</span>
            <span className="ml-1 text-green-300">
              ${user.balances?.teamCommission ?? 0}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Self Bonus:</span>
            <span className="ml-1 text-green-300">
              ${user.balances?.selfBonus ?? 0}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Signup:</span>
            <span className="ml-1 text-green-300">
              ${user.balances?.signupBonus ?? 0}
            </span>
          </div>
        </div>
        <div>
          <span className="font-semibold text-green-300">Status:</span>{" "}
          <span
            className={`${
              user.isKycApproved ? "text-green-400" : "text-red-400"
            } font-medium`}
          >
            {user.isKycApproved ? "KYC Verified" : "KYC Unverified"}
          </span>
        </div>
        <div>
          <span className="font-semibold text-green-300">Account Status:</span>{" "}
          <span className="font-medium">{user.accountStatus || "active"}</span>
        </div>
      </div>

      <div className="mt-8 bg-gray-700 p-4 rounded-xl border border-gray-600">
        <h3 className="text-xl font-bold mb-4 text-green-400">Add Balance</h3>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Enter amount"
            className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
          />
          <button
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-bold transition disabled:opacity-50"
            onClick={handleAddBalance}
            disabled={actionLoading}
          >
            {actionLoading ? "Adding..." : "Add"}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Note: This balance will be added to the user's Recharge bucket.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mt-8">
        <button
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-medium transition"
          onClick={handleDelete}
          disabled={actionLoading}
        >
          Delete
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-md font-medium transition"
          onClick={() => handleStatusChange("suspended")}
          disabled={actionLoading || user.accountStatus === "suspended"}
        >
          Suspend
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md font-medium transition"
          onClick={() => handleStatusChange("active")}
          disabled={actionLoading || user.accountStatus === "active"}
        >
          Activate
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition"
          onClick={() => handleStatusChange("frozen")}
          disabled={actionLoading || user.accountStatus === "frozen"}
        >
          Freeze
        </button>
      </div>
    </div>
  );
}

export default Userdetails;
