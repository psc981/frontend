import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { updateProfile } from "../api/api";
import Spinner from "../components/Spinner";
import {
  FaUser,
  FaEnvelope,
  FaLevelUpAlt,
  FaWallet,
  FaShareAlt,
  FaCheckCircle,
  FaEdit,
  FaCamera,
} from "react-icons/fa";

export default function Profile() {
  const { user, token, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [storeName, setStoreName] = useState(user?.storeName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  if (!user) {
    return <Spinner fullScreen={true} />;
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const { data } = await updateProfile(token, { profileImage: file });
      setUser(data.user); // update context with new image
      setProfileImage(null);
      toast.success("Profile image updated!");
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error(
        "Error uploading image: " + (err.response?.data?.error || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(user.referralCode || "N/A");
    toast.success("Referral code copied to clipboard!");
  };

  const handleSaveStoreName = async () => {
    try {
      setLoading(true);
      const { data } = await updateProfile(token, { storeName, profileImage });
      setUser(data.user); // update AuthContext
      setStoreName(data.user.storeName); // sync local state
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Update profile error:", err);

      toast.error(
        "Error updating profile: " + (err.response?.data?.error || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    console.log("Attempting to update email to:", email);
    try {
      setLoading(true);
      const { data } = await updateProfile(token, { email });
      console.log("Update success response:", data);
      setUser(data.user);
      setEmail(data.user.email); // sync local state
      setIsEditingEmail(false);
      toast.success("Email updated!");
    } catch (err) {
      console.error("Detailed update email error:", err);
      toast.error(
        "Error updating email: " + (err.response?.data?.error || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUsername = async () => {
    try {
      setLoading(true);
      const { data } = await updateProfile(token, { username });
      setUser(data.user); // update AuthContext
      setUsername(data.user.username); // sync local state
      setIsEditingUsername(false);
      toast.success("Username updated!");
    } catch (err) {
      console.error("Update username error:", err);
      toast.error(
        "Error updating username: " +
          (err.response?.data?.error || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const profileItems = [
    {
      label: "Store Name",
      value: isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="border px-2 py-1 rounded-md text-sm w-full"
          />
          <button
            onClick={handleSaveStoreName}
            disabled={loading}
            className="px-3 py-1 text-white bg-green-600 hover:bg-green-700 rounded-md text-sm"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span>{user.storeName}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-green-600 hover:text-green-700"
          >
            <FaEdit />
          </button>
        </div>
      ),
      icon: <FaUser />,
    },
    {
      label: "Username",
      value: isEditingUsername ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border px-2 py-1 rounded-md text-sm w-full"
          />
          <button
            onClick={handleSaveUsername}
            disabled={loading}
            className="px-3 py-1 text-white bg-green-600 hover:bg-green-700 rounded-md text-sm"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span>{user.username}</span>
          <button
            onClick={() => setIsEditingUsername(true)}
            className="text-green-600 hover:text-green-700"
          >
            <FaEdit />
          </button>
        </div>
      ),
      icon: <FaUser />,
    },
    {
      label: "Email",
      value: isEditingEmail ? (
        <div className="flex items-center gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-2 py-1 rounded-md text-sm w-full"
          />
          <button
            onClick={handleSaveEmail}
            disabled={loading}
            className="px-3 py-1 text-white bg-green-600 hover:bg-green-700 rounded-md text-sm"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span>{user.email}</span>
          <button
            onClick={() => setIsEditingEmail(true)}
            className="text-green-600 hover:text-green-700"
          >
            <FaEdit />
          </button>
        </div>
      ),
      icon: <FaEnvelope />,
    },
    {
      label: "Account Level",
      value: user.accountLevel,
      icon: <FaLevelUpAlt />,
    },
    {
      label: "Wallet Balance",
      value: `$${user.balance}`,
      icon: <FaWallet />,
    },
    {
      label: "Referral Code",
      value: (
        <div className="flex items-center gap-2">
          <span>{user.referralCode}</span>
          <button
            onClick={handleCopyReferral}
            className="px-2 py-1 text-xs font-medium bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Copy
          </button>
        </div>
      ),
      icon: <FaShareAlt />,
    },
    {
      label: "Verified",
      value: user.isKycApproved ? "Yes" : "No",
      icon: <FaCheckCircle />,
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <h1 className="text-3xl font-bold text-green-600 mb-6">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full border border-gray-100">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-200 relative">
          {/* Profile Image or Initial */}
          <div className="relative">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
              />
            ) : (
              <div className="w-16 h-16 bg-green-100 text-green-600 flex items-center justify-center rounded-full text-2xl font-bold">
                {(user.storeName || user.username || "G")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
            {user.isKycApproved && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <FaCheckCircle className="text-green-500 text-lg" />
              </div>
            )}
            <label className="absolute bottom-0 left-0 bg-green-600 p-1 rounded-full cursor-pointer text-white translate-x-[-25%]">
              <FaCamera size={14} />
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {user.storeName || user.username}
            </h2>
            <p className="text-gray-500 text-sm">@{user.username}</p>
            <p className="text-gray-500 text-[10px]">
              {user.isKycApproved ? "Verified User" : "Unverified"}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profileItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-gray-50 hover:bg-green-50 transition rounded-lg p-4"
            >
              <span className="text-green-600 text-lg">{item.icon}</span>
              <div>
                <p className="text-gray-500 text-sm">{item.label}</p>
                <div className="font-medium text-gray-800">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
