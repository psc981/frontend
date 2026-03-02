import React, { useEffect, useState, useContext } from "react";
import { getSystemSettings, updateSystemSettings } from "../../api/api";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const SocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState({
    whatsapp: "",
    telegram: "",
  });
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSystemSettings(token);
        if (res.data.socialLinks) {
          setSocialLinks(res.data.socialLinks);
        }
      } catch (error) {
        console.error("Error fetching social links:", error);
        toast.error("Failed to load social links");
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleSave = async () => {
    // Validate URLs
    const urlRegex = /^https?:\/\/.+/;
    if (socialLinks.whatsapp && !urlRegex.test(socialLinks.whatsapp)) {
      toast.error(
        "WhatsApp link must be a valid URL starting with http:// or https://",
      );
      return;
    }
    if (socialLinks.telegram && !urlRegex.test(socialLinks.telegram)) {
      toast.error(
        "Telegram link must be a valid URL starting with http:// or https://",
      );
      return;
    }
    try {
      await updateSystemSettings(token, { socialLinks });
      toast.success("Social links updated successfully");
    } catch (error) {
      console.error("Error updating social links:", error);
      toast.error("Failed to update social links");
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Official Channel Links
        </h2>
        <p className="text-gray-500 text-sm">
          These links will be displayed on the website for users to join your
          channels.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp Channel Link
          </label>
          <input
            type="url"
            value={socialLinks.whatsapp}
            onChange={(e) =>
              setSocialLinks({ ...socialLinks, whatsapp: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="https://whatsapp.com/channel/..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telegram Channel Link
          </label>
          <input
            type="url"
            value={socialLinks.telegram}
            onChange={(e) =>
              setSocialLinks({ ...socialLinks, telegram: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="https://t.me/channel_name"
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SocialLinks;
