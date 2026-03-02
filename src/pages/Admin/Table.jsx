import { FaEdit, FaTrashAlt } from "react-icons/fa";

function Table({ products, onDelete, onEdit }) {
  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Fixed height with scroll only inside table */}
      <div className="max-h-[400px] overflow-y-auto">
        <table className="min-w-full text-sm text-left text-gray-900">
          <thead className="bg-gray-100 text-gray-900 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3">S.No</th>
              <th className="px-6 py-3">Product Name</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id} className="border-b border-gray-200">
                <td className="px-6 py-3 font-medium">{index + 1}</td>
                <td className="px-6 py-3">{product.name}</td>
                <td className="px-6 py-3">${product.price}</td>
                <td className="px-6 py-3">{product.category}</td>
                <td className="px-6 py-3 flex space-x-4">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(product._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
