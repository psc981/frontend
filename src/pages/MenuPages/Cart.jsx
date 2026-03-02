import React, { useEffect } from "react";
import { FaShoppingCart, FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-8 flex items-center gap-3">
          <FaShoppingCart className="text-green-500 text-2xl" /> My Cart
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-10">
            <div className="mb-8">
              <img
                src="/My Cart.png"
                alt="Empty Cart"
                className="w-72 h-72 object-contain"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Your cart is currently empty.
            </h2>
            <p className="text-gray-500 mb-10 px-4">
              Time to fill it with great finds!
            </p>

            <div className="w-full max-w-sm px-2">
              <button
                onClick={() => navigate("/products")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-md transition duration-300 uppercase tracking-wide"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center"
                >
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-lg border"
                  />

                  {/* Product Info */}
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {item.name}
                    </h2>
                    <p className="text-green-600 font-bold mt-1">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="px-4 font-semibold text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center self-start">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-300 hover:text-red-500 transition p-2"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total and Checkout */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 transition uppercase tracking-wider"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-white text-red-500 font-medium py-3 rounded-xl border border-red-100 hover:bg-red-50 transition uppercase text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
