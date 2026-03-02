import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getChatUsers, getAdminUserMessages, replyToUser } from "../../api/api";
import Pusher from "pusher-js";
import { toast } from "react-toastify";

function AdminChat() {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    fetchUsers();

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    });

    const channel = pusher.subscribe("admin-chat");
    channel.bind("new-message", (data) => {
      // Refresh user list to show latest message/new user
      fetchUsers();

      // If the message is from the currently selected user, add it to messages
      if (selectedUser && data.message.user === selectedUser._id) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    return () => {
      pusher.unsubscribe("admin-chat");
    };
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const res = await getChatUsers(token);
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch chat users", err);
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    try {
      const res = await getAdminUserMessages(token, user._id);
      setMessages(res.data.messages);
      // Immediately clear unread count for the selected user in local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === user._id ? { ...u, unreadCount: 0 } : u,
        ),
      );
    } catch (err) {
      toast.error("Failed to fetch messages");
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || !selectedUser) return;

    try {
      const res = await replyToUser(token, selectedUser._id, {
        message: newMessage,
        image: selectedImage,
      });
      setMessages((prev) => [...prev, res.data.message]);
      setNewMessage("");
      clearImage();
      fetchUsers(); // Update last message in sidebar
    } catch (err) {
      toast.error("Failed to send reply");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] bg-white text-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-200">
      {/* Users List Sidebar */}
      <div className="w-full md:w-1/3 border-r border-gray-200 bg-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-100">
          <h2 className="text-xl font-bold text-green-600">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.map((u) => (
            <div
              key={u._id}
              onClick={() => handleSelectUser(u)}
              className={`p-4 cursor-pointer border-b border-gray-200 hover:bg-gray-200 transition ${
                selectedUser?._id === u._id
                  ? "bg-gray-200 border-l-4 border-l-green-500"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {u.name || u.email}
                  </h3>
                  <p className="text-sm text-gray-600 truncate w-40">
                    {u.lastMessage?.message ||
                      (u.lastMessage?.imageUrl
                        ? "sent an image"
                        : "No messages yet")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-500">
                    {u.lastMessage &&
                      new Date(u.lastMessage.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </span>
                  {u.unreadCount > 0 && (
                    <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                      {u.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No conversations yet
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Chat with{" "}
                <span className="text-green-600">
                  {selectedUser.name || selectedUser.email}
                </span>
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
              {messages.map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl shadow-md ${
                      msg.isAdmin
                        ? "bg-green-600 text-white rounded-tr-none"
                        : "bg-gray-200 text-gray-900 rounded-tl-none border border-gray-300"
                    }`}
                  >
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Chat attachment"
                        className="max-w-full rounded-lg mb-2 cursor-pointer hover:opacity-90"
                        onClick={() => window.open(msg.imageUrl, "_blank")}
                      />
                    )}
                    {msg.message && <p className="text-sm">{msg.message}</p>}
                    <span
                      className={`text-[10px] block mt-1 ${msg.isAdmin ? "text-green-100" : "text-gray-500"}`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendReply}
              className="p-4 border-t border-gray-200 bg-gray-100"
            >
              {previewUrl && (
                <div className="relative inline-block mb-2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 bg-gray-100 border border-gray-300 text-gray-900 rounded-full px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() && !selectedImage}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-full transition-all"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 flex-col gap-4">
            <svg
              className="w-16 h-16 opacity-20"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.59.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            <p className="text-xl">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminChat;
