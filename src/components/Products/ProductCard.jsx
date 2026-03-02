import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../../context/WishlistContext";
import OrderModal from "../../components/OrderModal";

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist } = useWishlist();
  const [showModal, setShowModal] = useState(false);

  const isLiked = wishlist.some((item) => item._id === product._id);

  return (
    <>
      <div
        onClick={() => setShowModal(true)} // ✅ open modal on card click
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-lg transition relative cursor-pointer"
      >
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // ✅ don’t trigger modal
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition"
        >
          {isLiked ? (
            <FaHeart className="w-5 h-5 text-red-500" />
          ) : (
            <FiHeart className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Product Image */}
        <div className="mb-3">
          <img
            src={product.image || "/no-image.png"}
            alt={product.name}
            className="w-full h-32 object-contain rounded-lg bg-gray-50"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-gray-500">{product.category}</p>
          {/* Stock + Rating Row */}
          <div className="flex items-center justify-between text-xs">
            <p className="text-gray-500">Stock: {product.stock || "N/A"}</p>
            <p className="text-yellow-500 font-medium">
              ⭐ {product.rating ? product.rating.toFixed(1) : "0.0"}
            </p>
          </div>
        </div>

        {/* Price + Buy Button */}
        <div className="mt-3 flex items-center justify-between">
          {/* Price on left */}
          <span className="text-green-600 font-semibold text-xs">
            ${product.price?.toFixed(0)}
          </span>

          {/* Buy Now button on right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true); // ✅ open modal via button
            }}
            className=" text-black border-green-500 border rounded-md text-[8px] font-medium px-[8px] py-1 transition"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <OrderModal product={product} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
