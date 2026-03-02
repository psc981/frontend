import React, { useEffect, useState } from "react";
import { FaWhatsapp, FaTelegram } from "react-icons/fa";
import { getSocialLinks } from "../api/api";

const SocialLinks = ({
  size = 40,
  className = "flex flex-row flex-wrap justify-center gap-4",
  showTitle = true,
}) => {
  const [socialLinks, setSocialLinks] = useState({
    whatsapp: "",
    telegram: "",
  });

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const res = await getSocialLinks();
        if (res.data.socialLinks) {
          setSocialLinks(res.data.socialLinks);
        }
      } catch (error) {
        console.error("Error fetching social links:", error);
      }
    };
    fetchSocialLinks();
  }, []);

  const isValidUrl = (url) => {
    return url && /^https?:\/\/.+/.test(url);
  };

  const iconClasses =
    "transition-all hover:scale-105 flex items-center gap-3 px-4 py-2 rounded-lg border shadow-sm hover:shadow-md";

  return (
    <div className="flex flex-col items-center">
      {showTitle && (
        <p className="text-gray-700 mb-4 text-center font-bold">
          To get free Bonus & Rewards join our official channels
        </p>
      )}
      <div className={className}>
        {isValidUrl(socialLinks.whatsapp) ? (
          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-green-600 border-green-200 bg-green-50 hover:bg-green-100 ${iconClasses}`}
            aria-label="Contact us on WhatsApp"
          >
            <span className="font-semibold text-sm">WhatsApp</span>
            <FaWhatsapp size={size} />
          </a>
        ) : (
          <span
            className={`text-gray-400 border-gray-200 bg-gray-50 flex items-center gap-3 px-4 py-2 rounded-lg border cursor-not-allowed`}
          >
            <span className="font-semibold text-sm">WhatsApp</span>
            <FaWhatsapp size={size} />
          </span>
        )}
        {isValidUrl(socialLinks.telegram) ? (
          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 ${iconClasses}`}
            aria-label="Contact us on Telegram"
          >
            <span className="font-semibold text-sm">Telegram</span>
            <FaTelegram size={size} />
          </a>
        ) : (
          <span
            className={`text-gray-400 border-gray-200 bg-gray-50 flex items-center gap-3 px-4 py-2 rounded-lg border cursor-not-allowed`}
          >
            <span className="font-semibold text-sm">Telegram</span>
            <FaTelegram size={size} />
          </span>
        )}
      </div>
    </div>
  );
};

export default SocialLinks;
