import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { ProductsProvider } from "./context/ProductsContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ProductsProvider>
            <OrderProvider>
              {" "}
              {/* ✅ wrap here */}
              <App />
            </OrderProvider>{" "}
          </ProductsProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  </StrictMode>
);
