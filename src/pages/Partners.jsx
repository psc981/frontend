import React, { useState, useEffect, useContext } from "react";
import {
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaRocket,
  FaLink,
  FaCheckCircle,
  FaTimes,
  FaVideo,
  FaFileUpload,
} from "react-icons/fa";
import { FiPlayCircle, FiCamera, FiUpload, FiDollarSign } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { updateSocialLinks, getProfile } from "../api/api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import Footer from "./Footer";

export default function Partners() {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [platformLinks, setPlatformLinks] = useState({
    YouTube: "",
    Facebook: "",
    Instagram: "",
    TikTok: "",
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await getProfile(token);

        if (profileRes.data.activityLinkHistory) {
          setHistory(profileRes.data.activityLinkHistory);
        }
      } catch (error) {
        console.error("Error fetching links:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleSaveActivityLink = async (platform) => {
    const link = platformLinks[platform];
    if (!link) {
      toast.error(`Please paste a ${platform} link first`);
      return;
    }
    setSaving(platform); // Store platform ID to show loading for specific button
    try {
      const res = await updateSocialLinks(token, {
        latestActivityLink: link,
        platform: platform,
      });
      setHistory(res.data.activityLinkHistory || []);
      setPlatformLinks((prev) => ({ ...prev, [platform]: "" })); // Clear the input after successful addition
      toast.success(`${platform} link added successfully`);
    } catch (error) {
      console.error("Error updating activity link:", error);
      toast.error(error.response?.data?.error || "Failed to add link");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="min-h-screen pb-20">
        {/* Link Integration Content */}
        <section className="py-8 md:py-12 px-4 md:px-6">
          <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10">
            {loading ? (
              <Spinner />
            ) : (
              <>
                {/* Share Your Story Banner */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-green-100 overflow-hidden relative">
                  {/* Background decorative shapes */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -mr-32 -mt-32 z-0 opacity-40" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-50 rounded-full -ml-24 -mb-24 z-0 opacity-40" />

                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
                      <div className="bg-orange-500 p-3 rounded-xl text-white shadow-lg">
                        <FiPlayCircle className="text-3xl md:text-4xl" />
                      </div>
                      <div className="text-center md:text-left">
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-emerald-900 leading-tight">
                          Share Your Story & <br />
                          <span className="text-green-600">
                            Get Rewarded on PSC!
                          </span>
                        </h1>
                      </div>
                    </div>

                    <p className="text-base sm:text-lg md:text-xl text-emerald-800 font-semibold mb-8 md:mb-10 max-w-3xl text-center md:text-left">
                      Ready to turn your creativity into cash? We're looking for
                      creators to showcase the PSC platform!
                    </p>

                    <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center relative">
                      {/* Left: How to Enter */}
                      <div className="space-y-6 md:space-y-8">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                          <div className="bg-green-600 p-2 rounded-lg text-white">
                            <FiCamera />
                          </div>
                          <h3 className="text-xl md:text-2xl font-black text-emerald-900">
                            How to Enter
                          </h3>
                        </div>

                        <div className="space-y-5 md:space-y-6">
                          <div className="flex gap-4">
                            <div className="bg-emerald-900 text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-base md:text-lg shadow-sm">
                              1
                            </div>
                            <div>
                              <p className="text-emerald-900 font-black text-base md:text-lg">
                                Create:
                              </p>
                              <p className="text-emerald-700 text-sm md:text-lg">
                                Record a short video (up to 30 seconds) about
                                your experience with PSC.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="bg-emerald-900 text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-base md:text-lg shadow-sm">
                              2
                            </div>
                            <div>
                              <p className="text-emerald-900 font-black text-base md:text-lg">
                                Submit:
                              </p>
                              <p className="text-emerald-700 text-sm md:text-lg">
                                Copy your video link.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="bg-emerald-900 text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-base md:text-lg shadow-sm">
                              3
                            </div>
                            <div>
                              <p className="text-emerald-900 font-black text-base md:text-lg">
                                Upload:
                              </p>
                              <p className="text-emerald-700 text-sm md:text-lg">
                                Paste the link into "Partner Content Rewards"
                                section on our platform.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Winning Potential */}
                      <div className="flex flex-col items-center md:items-start text-center md:text-left relative py-4 md:py-8 px-2 md:px-4">
                        {/* Green diagonal line decorative */}
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-green-500 rounded-full transform -rotate-12 opacity-80 hidden md:block" />

                        <div className="flex items-center gap-2 mb-4 md:mb-6 ml-0 md:ml-8">
                          <FiDollarSign className="text-green-600 text-2xl md:text-3xl font-bold" />
                          <h3 className="text-xl md:text-2xl font-extrabold text-emerald-900 uppercase tracking-tighter">
                            Winning Potential
                          </h3>
                        </div>

                        <div className="relative ml-0 md:ml-8">
                          <div className="text-[90px] sm:text-[120px] md:text-[180px] font-black text-green-500 leading-none opacity-40">
                            20
                          </div>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-emerald-900 text-lg md:text-xl font-bold">
                              lucky creators
                            </span>
                            <span className="text-emerald-800 text-xs md:text-lg uppercase font-medium">
                              will win rewards ranging from
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 ml-0 md:ml-8">
                          <p className="text-3xl sm:text-4xl md:text-7xl font-black text-green-600 tracking-tight">
                            $2 to $100!
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 md:mt-12 bg-green-50 py-4 px-6 md:px-8 rounded-xl border border-green-100 text-center md:text-left shadow-inner">
                      <p className="text-emerald-900 text-base md:text-xl font-semibold">
                        <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold mr-3 inline-block mb-2 md:mb-0">
                          Pro-Tip:
                        </span>
                        Make it engaging! Authenticity is what we love most.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Join the Inner Circle */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 text-center md:text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 z-0 opacity-50" />
                  <div className="bg-orange-50 p-4 md:p-5 rounded-full z-10">
                    <FaRocket className="text-orange-500 text-2xl md:text-3xl" />
                  </div>
                  <div className="flex-grow z-10">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                      Join the Inner Circle
                    </h2>
                    <p className="text-sm md:text-base text-gray-500 max-w-2xl">
                      Become a Partner Seller. Team members enjoy exclusive
                      weekly gifts, performance bonuses, and premium benefits.
                      Experience the full potential of PSC.
                    </p>
                  </div>
                </div>

                {/* Content Distribution Hub */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <FaLink className="text-blue-500 text-xl" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-800">
                      Content Distribution Hub
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8">
                    Choose a platform, paste your video link, and submit for
                    verification.
                  </p>

                  <div className="space-y-4 md:space-y-6">
                    {[
                      {
                        id: "YouTube reels",
                        icon: <FaYoutube size={24} />,
                        color: "bg-red-600",
                      },
                      {
                        id: "Facebook reels",
                        icon: <FaFacebook size={24} />,
                        color: "bg-blue-600",
                      },
                      {
                        id: "Instagram reels",
                        icon: <FaInstagram size={24} />,
                        color:
                          "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
                      },
                      {
                        id: "TikTok reels",
                        icon: <FaTiktok size={24} />,
                        color: "bg-black",
                      },
                    ].map((plat) => (
                      <div
                        key={plat.id}
                        className="flex flex-col md:flex-row items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-green-200 transition-all font-semibold"
                      >
                        <div className="flex items-center gap-4 w-full md:w-52 flex-shrink-0">
                          <div
                            className={`${plat.color} w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0`}
                          >
                            {plat.icon}
                          </div>
                          <span className="font-bold text-gray-700 whitespace-nowrap">
                            {plat.id}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row flex-grow gap-2 w-full">
                          <input
                            type="text"
                            placeholder={`Paste PSC video link here...`}
                            className="flex-grow bg-white border border-gray-200 p-3 rounded-xl outline-none focus:border-green-400 transition-all text-sm"
                            value={platformLinks[plat.id]}
                            onChange={(e) =>
                              setPlatformLinks({
                                ...platformLinks,
                                [plat.id]: e.target.value,
                              })
                            }
                          />
                          <button
                            onClick={() => handleSaveActivityLink(plat.id)}
                            disabled={saving === plat.id}
                            className="bg-green-500 text-white px-4 md:px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap shadow-sm shadow-green-100 w-full sm:w-auto text-center"
                          >
                            {saving === plat.id ? "ADDING..." : "ADD LINK"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity History Card */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <FaLink className="text-orange-500 text-xl" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-800">
                      Review Activity Link History
                    </h2>
                  </div>

                  <div className="overflow-x-auto -mx-6 md:mx-0">
                    <div className="inline-block min-w-full align-middle px-6 md:px-0">
                      {history.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="pb-4 font-bold text-gray-600 text-xs md:text-sm whitespace-nowrap">
                                #
                              </th>
                              <th className="pb-4 font-bold text-gray-600 text-xs md:text-sm whitespace-nowrap px-2">
                                Platform
                              </th>
                              <th className="pb-4 font-bold text-gray-600 text-xs md:text-sm whitespace-nowrap px-2">
                                Submit Time
                              </th>
                              <th className="pb-4 font-bold text-gray-600 text-xs md:text-sm whitespace-nowrap px-2">
                                Submit Links
                              </th>
                              <th className="pb-4 font-bold text-gray-600 text-xs md:text-sm whitespace-nowrap px-2">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {history.map((item, index) => (
                              <tr
                                key={index}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="py-4 text-xs md:text-sm text-gray-500">
                                  {history.length - index}
                                </td>
                                <td className="py-4 text-xs md:text-sm font-semibold text-gray-700 uppercase px-2">
                                  {item.platform || "N/A"}
                                </td>
                                <td className="py-4 text-xs md:text-sm text-gray-500 px-2 whitespace-nowrap">
                                  {new Date(item.date).toLocaleString()}
                                </td>
                                <td className="py-4 text-xs md:text-sm px-2">
                                  <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline break-all block max-w-[150px] sm:max-w-xs md:max-w-md lg:max-w-sm"
                                  >
                                    {item.link}
                                  </a>
                                </td>
                                <td className="py-4 px-2">
                                  <span className="bg-green-100 text-green-700 text-[9px] md:text-[10px] font-bold px-2 py-1 rounded uppercase scale-75 md:scale-100 inline-block">
                                    Submitted
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-center py-10">
                          <div className="text-4xl mb-3">📂</div>
                          <p className="text-gray-400">
                            No activity history found.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
