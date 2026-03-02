import React, { useEffect, useState, useContext } from "react";
import { FaEnvelope, FaTrashAlt, FaCalendarAlt } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { getAnnouncements } from "../../api/api";
import Spinner from "../../components/Spinner";

export default function Messages() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const res = await getAnnouncements(token);
        setAnnouncements(res.data?.announcements || []);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [token]);

  return (
    <div className="p-6 min-h-screen bg-green-50">
      {/* Header */}
      <h1 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
        <FaEnvelope className="text-green-500" /> Announcements
      </h1>

      {loading ? (
        <Spinner />
      ) : announcements.length === 0 ? (
        <p className="text-gray-600">No announcements available.</p>
      ) : (
        <div className="grid gap-4">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="relative bg-white border border-green-100 shadow-sm rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              {/* Title */}
              <h2 className="text-lg font-semibold text-green-700 mb-2">
                {a.title || "Untitled"}
              </h2>

              {/* Message */}
              <p className="text-gray-700 mb-3">{a.message || a.content}</p>

              {/* Footer Info */}
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                  <FaCalendarAlt className="text-green-500" />
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
                <span className="text-green-600 font-medium">
                  Posted by: {a.createdBy?.username || "Admin"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
