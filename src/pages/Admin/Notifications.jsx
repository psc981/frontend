import React, { useEffect, useState, useContext } from "react";
import { getNotifications, markNotificationRead } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { FaBell } from "react-icons/fa";

export default function Notifications() {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!token) return;

    const cleanup = async () => {
      try {
        // 1. Fetch current notifications
        const { data } = await getNotifications(token);
        const fetchedNotis = Array.isArray(data.notifications)
          ? data.notifications
          : [];

        // 2. Update local state (mark them as read locally immediately for UI snappiness)
        setNotifications(fetchedNotis.map((n) => ({ ...n, isRead: true })));

        // 3. Tell backend to mark all as read
        if (fetchedNotis.some((n) => !n.isRead)) {
          await markNotificationRead(token, "all");
        }
      } catch (err) {
        console.error("Failed to handle notifications", err);
      }
    };

    cleanup();
  }, [token]);

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-600 flex items-center gap-2">
          <FaBell className="text-green-500" /> Notifications
        </h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-600 text-center py-10">
            No notifications available.
          </p>
        ) : (
          notifications.map((noti, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg transition-all ${
                noti.isRead
                  ? "bg-gray-50 border border-transparent"
                  : "bg-green-50 border border-green-200 shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start">
                <p className="text-gray-800 font-medium">{noti.message}</p>
                {!noti.isRead && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {new Date(noti.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
