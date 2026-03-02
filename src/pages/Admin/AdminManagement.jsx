import React, { useState, useEffect, useContext } from "react";
import {
  FaTrashAlt,
  FaEdit,
  FaPlus,
  FaKey,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";

function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchAdmins();
  }, [token]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await getAllAdmins(token);
      setAdmins(res.data.admins);
    } catch (err) {
      toast.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({ username: admin.username, password: "" });
    } else {
      setEditingAdmin(null);
      setFormData({ username: "", password: "" });
    }
    setShowPassword(false);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        await updateAdmin(token, editingAdmin._id, formData);
        toast.success("Admin updated successfully");
      } else {
        await createAdmin(token, formData);
        toast.success("Admin created successfully");
      }
      setIsFormOpen(false);
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.error || "Operation failed");
    }
  };

  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAdmin(token, adminToDelete._id);
      toast.success("Admin deleted successfully");
      setAdmins(admins.filter((a) => a._id !== adminToDelete._id));
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to delete admin");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Management</h1>
        <button
          onClick={() => handleOpenForm()}
          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 transition"
        >
          <FaPlus size={14} /> Add Admin
        </button>
      </div>

      {loading ? (
        <p>Loading admins...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {admin.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                    <button
                      onClick={() => handleOpenForm(admin)}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <FaEdit /> Edit / Reset Pass
                    </button>
                    <button
                      onClick={() => handleDeleteClick(admin)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingAdmin ? "Edit Admin" : "Add New Admin"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {editingAdmin
                    ? "New Password (leave blank to keep current)"
                    : "Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white pr-10"
                    required={!editingAdmin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 mt-0.5"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {editingAdmin ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Admin"
        message={`Are you sure you want to delete ${adminToDelete?.username}? This action cannot be undone.`}
      />
    </div>
  );
}

export default AdminManagement;
