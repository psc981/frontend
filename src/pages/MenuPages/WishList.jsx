import React, { useEffect } from "react";
import { FaHeart, FaShoppingCart, FaStore } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

function WishList() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { cart, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-2 flex items-center gap-3">
          <FaShoppingCart className="text-green-500 text-2xl" /> Wishlist
        </h1>

        <p className="text-gray-400 text-lg mb-8">No items in wishlist yet.</p>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-10">
            <div className="mb-8">
              <img
                src="/Wishlist.png"
                alt="Empty Wishlist"
                className="w-72 h-72 object-contain"
              />
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Your wishlist is currently empty.
            </h2>
            <p className="text-gray-600 mb-10 px-4">
              Save items you love and want to buy later!
            </p>

            <div className="w-full max-w-sm px-2">
              <button
                onClick={() => navigate("/products")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-md transition duration-300 uppercase tracking-wide"
              >
                Start Browsing
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => {
              const isInCart = cart.some(
                (cartItem) => cartItem._id === item._id,
              );

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-40 object-contain"
                    />
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow text-red-500 hover:text-red-600"
                    >
                      <FaHeart />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 mt-4">
                    <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
                      {item.name}
                    </h2>
                    {item.oldPrice && (
                      <p className="text-xs text-gray-500 line-through">
                        ${item.oldPrice.toFixed(2)}
                      </p>
                    )}
                    <p className="text-green-600 font-bold">
                      ${item.price.toFixed(2)}
                    </p>
                    {item.store && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                        <FaStore />
                        <span>Sold by {item.store}</span>
                      </div>
                    )}
                  </div>

                  {/* Add/Remove to Cart Button */}
                  <button
                    onClick={() => {
                      if (isInCart) {
                        removeFromCart(item._id);
                      } else {
                        addToCart(item);
                      }
                    }}
                    className={`mt-4 py-2 rounded-lg flex items-center justify-center gap-2 transition ${
                      isInCart
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    <FaShoppingCart />
                    {isInCart ? "Remove from Cart" : "Add to Cart"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default WishList;
