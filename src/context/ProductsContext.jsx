// src/context/ProductsContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getProducts, getProductsByCategory } from "../api/productsApi";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(products);
  // fetch products whenever category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = selectedCategory
          ? await getProductsByCategory(selectedCategory)
          : await getProducts();
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  // filter by search query
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProductsContext.Provider
      value={{
        products: filteredProducts,
        loading,
        error,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
