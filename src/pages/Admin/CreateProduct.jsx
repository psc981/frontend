import { toast } from "react-toastify";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../api/productsApi";
import { CATEGORIES } from "../../constants/categories";

function CreateProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "", // <-- add this
    rating: "",
    image: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const productFormData = new FormData();
    productFormData.append("name", formData.name);
    productFormData.append("price", formData.price);
    productFormData.append("category", formData.category);
    productFormData.append("stock", formData.stock); // <-- add this
    productFormData.append("rating", formData.rating); // <-- add this
    if (formData.image) {
      productFormData.append("image", formData.image);
    }

    try {
      const response = await createProduct(productFormData, token);
      toast.success("✅ Product created successfully!");
      navigate("/psc/admin-products");
    } catch (error) {
      // Show generic error message
      toast.error("❌ Failed to create product. Please try again.");
      console.error("Error creating product:", error);
    }
  };

  const handleBack = () => {
    navigate("/psc/admin-products");
  };

  return (
    <div className="flex flex-col justify-start items-center">
      <div className="max-w-7xl w-full">
        <button
          onClick={handleBack}
          className="bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-700 mb-6 w-full sm:w-auto"
        >
          Back to Products
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="price"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="stock"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="rating"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              Rating
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="category"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
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

          <div className="mb-6">
            <label
              htmlFor="image"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              Product Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
            />
            {formData.image && (
              <div className="mt-4">
                <h3 className="text-gray-700">Image Preview:</h3>
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Product Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg shadow-md"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;
