import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Create a new product (Admin only)
export const createProduct = (data, token) =>
  API.post("/products/create", data, {
    headers: { Authorization: `Bearer ${token}` }, // REMOVE Content-Type
  });
// Get all products
export const getProducts = (search = "") =>
  API.get(`/products${search ? `?search=${search}` : ""}`);
// Get products by category
export const getProductsByCategory = (category) =>
  API.get(`/products/category/${category}`);
// Get a single product by ID
export const getProductById = (id) => API.get(`/products/${id}`);

// Update an existing product (Admin only)
export const updateProduct = (id, data, token) =>
  API.put(`/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Delete a product (Admin only)
export const deleteProduct = (id, token) =>
  API.delete(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
