import React, { useState, useEffect, useContext } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { getUsers, deleteUser } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import ConfirmationModal from "../../components/ConfirmationModal";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); // Get token from context

  const fetchUsers = async (search = "") => {
    try {
      setLoading(true);
      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        return;
      }

      const response = await getUsers(token, search);
      if (response.status === 200) {
        setUsers(response.data.users);
      } else {
        setError("Failed to fetch users");
      }
      setLoading(false);
    } catch (err) {
      setError("Error fetching users");
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [token, searchTerm]);

  const handleDeleteUser = (id) => {
    setUserToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (!token || !userToDelete) {
        setError("No token or user selected.");
        return;
      }

      const response = await deleteUser(token, userToDelete);
      if (response.status === 200) {
        setUsers(users.filter((user) => user._id !== userToDelete));
      } else {
        setError("Failed to delete user");
      }
    } catch (error) {
      setError("Error deleting user");
    }
  };

  return (
    <div className="flex flex-col justify-start items-center">
      <div className="max-w-7xl w-full">
        <h2 className="text-2xl font-bold mb-4">Users Management</h2>

        <div className="mb-4 flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <input
            type="text"
            placeholder="Search by name, username, or email..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="min-w-full text-sm text-left text-gray-900">
                <thead className="bg-gray-100 text-gray-900 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3">S.No</th>
                    <th className="px-6 py-3">Username</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id} className="border-b border-gray-200">
                      <td className="px-6 py-3 font-medium">{index + 1}</td>
                      <td className="px-6 py-3">{user.name}</td>
                      <td className="px-6 py-3">{user.fullName || "N/A"}</td>
                      <td className="px-6 py-3">{user.email}</td>
                      <td className="px-6 py-3 capitalize">{user.role}</td>
                      <td className="px-6 py-3 flex space-x-4">
                        <button
                          onClick={() => navigate(`/psc/users/${user._id}`)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

export default Users;
