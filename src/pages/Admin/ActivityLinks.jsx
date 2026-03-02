import React, { useState, useEffect, useContext } from "react";
import { getUsers } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";

function ActivityLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);
        const response = await getUsers(token);
        if (response.status === 200) {
          const allLinks = [];
          response.data.users.forEach((user) => {
            if (
              user.activityLinkHistory &&
              user.activityLinkHistory.length > 0
            ) {
              user.activityLinkHistory.forEach((history) => {
                allLinks.push({
                  ...history,
                  userName: user.name,
                  userEmail: user.email,
                  userId: user._id,
                });
              });
            }
          });
          // Sort by date descending
          allLinks.sort((a, b) => new Date(b.date) - new Date(a.date));
          setLinks(allLinks);
        } else {
          setError("Failed to fetch activity links");
        }
      } catch (err) {
        setError("Error fetching activity links");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLinks();
    }
  }, [token]);

  if (loading) return <Spinner />;

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center md:text-left">
        Activity Submission History
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {links.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
                  <th className="p-4 text-sm font-bold min-w-[150px]">Date</th>
                  <th className="p-4 text-sm font-bold">User</th>
                  <th className="p-4 text-sm font-bold">Platform</th>
                  <th className="p-4 text-sm font-bold">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {links.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(item.date).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">
                          {item.userName}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {item.userEmail}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-semibold uppercase">
                      <span
                        className={`px-2 py-1 rounded text-[10px] ${
                          item.platform?.toLowerCase() === "youtube"
                            ? "bg-red-100 text-red-700"
                            : item.platform?.toLowerCase() === "instagram"
                              ? "bg-pink-100 text-pink-700"
                              : item.platform?.toLowerCase() === "tiktok"
                                ? "bg-gray-900 text-white"
                                : item.platform?.toLowerCase() === "facebook"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.platform || "N/A"}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {item.link}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-10 text-center text-gray-500 italic">
              No activity links submitted yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityLinks;
