import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
  updateProduct,
} from "../../api/productsApi";
import Table from "./Table";
import Spinner from "../../components/Spinner";
import { CATEGORIES } from "../../constants/categories";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [image, setImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchProducts = async (search = "") => {
    try {
      setLoading(true);
      const response = await getProducts(search);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching products");
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await deleteProduct(id, token);
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      setError("Error deleting product");
    }
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setImage(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProductToEdit(null);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", e.target.name.value);
    formData.append("price", e.target.price.value);
    formData.append("category", e.target.category.value);
    if (image) formData.append("image", image);

    try {
      // Make the update request
      const updatedProduct = await updateProduct(
        productToEdit._id,
        formData,
        token,
      );

      // Replace the old product in the state with the updated product
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productToEdit._id ? updatedProduct.data : product,
        ),
      );

      handleCloseModal();
    } catch (error) {
      setError("Error updating product");
    }
  };

  const handleCreateProduct = () => {
    navigate("/psc/create-product");
  };

  return (
    <div className="flex flex-col">
      <div className="max-w-full mx-auto w-full">
        <h2 className="text-2xl font-bold mb-6">Products Management</h2>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <input
            type="text"
            placeholder="Search products by name or category..."
            className="w-full sm:max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleCreateProduct}
            className="w-full sm:w-auto bg-green-600 text-white text-xs sm:text-sm py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 font-bold"
          >
            Create Product
          </button>
        </div>

        {loading && <Spinner />}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            {products.length > 0 ? (
              <Table
                products={products}
                onDelete={handleDeleteProduct}
                onEdit={handleEditProduct}
              />
            ) : (
              <p className="p-6 text-center text-gray-500 italic">
                No products found.
              </p>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold mb-4">Edit Product</h3>
            <form onSubmit={handleUpdateProduct}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={productToEdit?.name}
                  className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  defaultValue={productToEdit?.price}
                  className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue={productToEdit?.category}
                  className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
                  required
                >
                  <option value="">-- Select Category --</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700">
                  Image (optional)
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
