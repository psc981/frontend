import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import { FaShoppingCart, FaUsers, FaDollarSign, FaBox } from "react-icons/fa";
import Spinner from "../../components/Spinner";
import { getProducts } from "../../api/productsApi"; // API for getting products
import { getAllOrders, getTotalRevenue, getUsers } from "../../api/api"; // Create an API function for users (assuming it's available)

function AdminDashboard() {
  const { user, token, loading } = useContext(AuthContext); // Access user, token, and loading from context
  const [totalOrders, setTotalOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);

  // Local state to hold the total users and products count
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch total products and total users when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        // Fetch total products
        const productRes = await getProducts(token); // Pass the token to API
        setTotalProducts(productRes?.data?.length || 0); // Fallback to 0 if no data

        // Fetch total users

        const ordersRes = await getAllOrders(token);
        setTotalOrders(ordersRes?.data?.orders?.length || 0);

        const userRes = await getUsers(token); // Pass the token to API
        setTotalUsers(userRes?.data?.users?.length); // Access the  const revenueRes = await getTotalRevenue(token);
        const revenueRes = await getTotalRevenue(token);
        setRevenue(revenueRes?.data?.totalRevenue || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to zero if there's an error
        setTotalProducts(0);
        setTotalUsers(0);
      } finally {
        setDataLoading(false);
      }
    };

    // Run the fetchData function
    if (token) {
      fetchData();
    }
  }, [token]); // Add token as dependency to refetch when the token changes

  // Handle case when user data is not loaded yet
  if (loading || dataLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4">
      <div className="flex items-center mb-6">
        {/* Display the admin's username */}
        <h2 className="text-3xl font-bold text-gray-700">
          Welcome, {user?.username || "Admin"}!
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Products Card */}
        <div className="bg-green-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-all ease-in-out duration-300">
          <div className="flex items-center space-x-4">
            <FaBox className="text-white text-2xl" />
            <div>
              <h3 className="text-lg font-semibold text-white">
                Total Products
              </h3>
              <p className="text-2xl text-white">{totalProducts || "0"}</p>
            </div>
          </div>
        </div>

        {/* Total Users Card */}
        <div className="bg-green-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-all ease-in-out duration-300">
          <div className="flex items-center space-x-4">
            <FaUsers className="text-white text-2xl sm:text-3xl lg:text-4xl" />
            <div>
              <h3 className="text-lg font-semibold text-white">Total Users</h3>
              <p className="text-2xl text-white">{totalUsers || "0"}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-all ease-in-out duration-300">
          <div className="flex items-center space-x-4">
            <FaDollarSign className="text-white text-2xl" />
            <div>
              <h3 className="text-lg font-semibold text-white">Revenue</h3>
              <p className="text-2xl text-white">${revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-green-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-all ease-in-out duration-300">
          <div className="flex items-center space-x-4">
            <FaShoppingCart className="text-white text-2xl" />
            <div>
              <h3 className="text-lg font-semibold text-white">Total Orders</h3>
              <p className="text-2xl text-white">{totalOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add more dashboard content here */}
    </div>
  );
}

export default AdminDashboard;
