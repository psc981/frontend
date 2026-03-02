export default function PromoBanner() {
  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 mb-6 relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-white text-xl font-bold mb-2">
          Get 30% OFF on Swimwear!
        </h2>
        <p className="text-green-100 mb-4">Limited time offer. Shop now!</p>
        <button className="bg-white text-green-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
          💰 Shop Now
        </button>
      </div>
      <div className="absolute right-4 top-4">
        <img
          src="/swimming-goggles-product.jpg"
          alt="Swimming goggles"
          className="w-24 h-24 object-contain"
        />
      </div>
      <div className="flex justify-center mt-4 gap-2">
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
      </div>
    </div>
  );
}
