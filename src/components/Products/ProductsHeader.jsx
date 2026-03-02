import { useProducts } from "../../context/ProductsContext";
import { FiFilter, FiStar, FiSquare, FiTag, FiSearch } from "react-icons/fi";
import { CATEGORIES as categories } from "../../constants/categories";

// put longer ones last
const sortedCategories = [...categories].sort(
  (a, b) => a.name.length - b.name.length,
);

const filters = [
  { name: "Filter", icon: <FiFilter /> },
  { name: "Rating", icon: <FiStar /> },
  { name: "Size", icon: <FiSquare /> },
  { name: "Brand", icon: <FiTag /> },
];

export default function ProductsHeader() {
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } =
    useProducts();

  return (
    <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
      {/* Search + Dropdown in flex */}
      <div className="flex gap-3 mb-4">
        {/* Search input with icon */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 rounded-lg w-24 sm:w-40 md:w-48 bg-green-500 text-white font-medium border border-green-600 
             focus:outline-none focus:ring-2 focus:ring-green-300 appearance-none transition-colors duration-200"
          style={{
            WebkitAppearance: "none",
            MozAppearance: "none",
            appearance: "none",
          }}
        >
          <option value="">All Categories</option>
          {sortedCategories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((f, i) => (
          <button
            key={i}
            className="flex items-center gap-2 px-2 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-blue-50 border rounded-3xl border-gray-100 hover:text-blue-600 transition whitespace-nowrap"
          >
            {f.icon} {f.name}
          </button>
        ))}
      </div>

      {/* Category Icons Grid (5x5 on small screens) */}
      <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap sm:justify-start">
        {sortedCategories.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(isActive ? "" : cat.name)}
              className={`flex flex-col items-center justify-center p-[3px] text-center transition rounded-xl 
              ${
                isActive
                  ? "bg-green-500 text-white"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-300"
              }`}
            >
              <span className="text-lg sm:text-xl">{cat.icon}</span>
              <span className="text-[10px] sm:text-[9px] truncate w-full">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
