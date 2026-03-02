"use client";
import { useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiUsers,
  FiBox,
  FiTruck,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
} from "react-icons/fi";
import Footer from "./Footer";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] bg-green-50 flex flex-col w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 md:p-6 w-full border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">◊</span>
          </div>
          <span className="text-green-600 font-bold text-xl">PSC</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-black cursor-pointer text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Become Seller
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col justify-center px-4 md:px-6 w-full h-[80vh]">
        <div className="text-center md:text-left w-full">
          <h1 className="text-4xl sm:text-6xl font-bold text-black leading-tight mb-6">
            Global TOP1 brand dropshipping one-stop solution.
          </h1>
          <p className="text-gray-700 text-lg md:text-xl mb-8 w-full max-w-2xl">
            Great cooperation. Great development. Provide an integrated and
            comprehensive brand dropshipping service.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full md:w-auto px-8 py-4 bg-black text-white cursor-pointer rounded-full text-lg font-medium hover:bg-gray-800 transition-colors mb-12"
          >
            Start your operation
          </button>
        </div>
      </main>

      {/* How It Works */}
      <section className="px-6 py-12 bg-white">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-8">
          How It Works
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 text-center">
          {[
            {
              icon: <FiUsers />,
              title: "Partner Onboarding",
              desc: "Join the platform and create your own store.",
            },
            {
              icon: <FiBox />,
              title: "Product Selection",
              desc: "Choose from a wide catalog to sell.",
            },
            {
              icon: <FiShoppingCart />,
              title: "Order Placement",
              desc: "Customers order directly from your store.",
            },
            {
              icon: <FiTruck />,
              title: "Order Fulfillment",
              desc: "We process, package, and ship products.",
            },
            {
              icon: <FiDollarSign />,
              title: "Partner Earnings",
              desc: "Earn commissions on every sale.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center border border-gray-100"
            >
              <div className="text-green-600 text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="px-6 py-12 bg-green-50">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-8">
          Key Features
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 text-center">
          {[
            {
              icon: <FiBox />,
              title: "Product Variety",
              desc: "Huge catalog of products ready to sell.",
            },
            {
              icon: <FiCheckCircle />,
              title: "Easy Store Management",
              desc: "User-friendly dashboard for partners.",
            },
            {
              icon: <FiTruck />,
              title: "Timely Shipping",
              desc: "Fast and reliable delivery to customers.",
            },
            {
              icon: <FiUsers />,
              title: "Customer Support",
              desc: "Dedicated support for you and your buyers.",
            },
            {
              icon: <FiTrendingUp />,
              title: "Performance Tracking",
              desc: "Monitor sales, earnings, and growth.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center border border-gray-100"
            >
              <div className="text-green-600 text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 py-12 bg-white">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-8">
          Why Choose Us?
        </h2>
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <h3 className="text-xl font-semibold mb-4 text-green-800">
              Our Platform
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center space-x-2">
                <FiCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Competitive commission rates</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Wide product range</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Reliable & fast shipping</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiCheckCircle className="text-green-500 flex-shrink-0" />
                <span>Dedicated customer support</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Other Platforms
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center space-x-2">
                <FiXCircle className="text-red-500 flex-shrink-0" />
                <span>Higher commissions</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiXCircle className="text-red-500 flex-shrink-0" />
                <span>Limited product selection</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiXCircle className="text-red-500 flex-shrink-0" />
                <span>Slower & unreliable shipping</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiXCircle className="text-red-500 flex-shrink-0" />
                <span>Minimal support</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
