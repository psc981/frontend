import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} from "../../api/api";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";

function AdminMessages() {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await getAnnouncements();
      setAnnouncements(res.data.announcements);
    } catch (err) {
      toast.error("Failed to fetch announcements");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !message) return toast.warn("Please fill all fields");

    try {
      await createAnnouncement(token, { title, message });
      toast.success("Announcement created successfully");
      setTitle("");
      setMessage("");
      fetchAnnouncements();
    } catch (err) {
      toast.error("Failed to create announcement");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await deleteAnnouncement(token, id);
      toast.success("Announcement deleted");
      fetchAnnouncements();
    } catch (err) {
      toast.error("Failed to delete announcement");
    }
  };

  return (
    <div className="text-black">
      {/* Form Section */}
      <form
        onSubmit={handleCreate}
        className="bg-white rounded-xl p-6 mb-8 shadow-lg space-y-4 border"
      >
        <h3 className="text-sm font-semibold text-green-600 mb-2">
          Create New Announcement
        </h3>
        <input
          type="text"
          placeholder="Enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded bg-gray-100 text-gray-900 focus:ring-2 focus:ring-green-500 outline-none border border-gray-300"
        />
        <textarea
          placeholder="Write your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 rounded bg-gray-100 text-gray-900 focus:ring-2 focus:ring-green-500 outline-none border border-gray-300"
          rows={4}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
        >
          Post Announcement
        </button>
      </form>

      {/* Announcements List */}
      <div className="space-y-6">
        {announcements.map((a) => (
          <div
            key={a._id}
            className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-green-200/20 transition border"
          >
            <button
              onClick={() => handleDelete(a._id)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-600 transition"
              title="Delete"
            >
              <FaTrashAlt />
            </button>

            <h3 className="text-xl font-semibold text-green-600 mb-2">
              {a.title || "Untitled"}
            </h3>
            <p className="text-gray-700 mb-3">{a.message}</p>
            <p className="text-sm text-gray-500">
              By{" "}
              <span className="text-green-600 font-medium">
                {a.createdBy?.username || "Admin"}
              </span>{" "}
              — {new Date(a.createdAt).toLocaleString()}
            </p>
          </div>
        ))}

        {announcements.length === 0 && (
          <p className="text-gray-500 text-center">
            No announcements yet. Create one above.
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminMessages;
