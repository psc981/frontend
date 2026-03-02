import React, { useContext } from "react";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { adminMenuItems } from "./AdminMenu";
import { AuthContext } from "../../context/AuthContext";

function AdminSidebar({ closeSidebar, setActiveLink, activeLink }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    closeSidebar();
  };

  const handleLogout = () => {
    logout();
    navigate("/psc-login");
  };

  return (
    <div className="h-full bg-green-800 p-4 border-r text-white relative flex flex-col">
      {/* Close button (mobile) */}
      <button
        onClick={closeSidebar}
        className="absolute top-4 right-4 sm:hidden text-white text-2xl"
      >
        <FaTimes />
      </button>

      {/* Sidebar Links + Logout pinned bottom */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Menu Items */}
        <ul className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 pr-2">
          {adminMenuItems
            .filter((item) => item.name !== "Logout")
            .map((item) => (
              <li
                key={item.name}
                className={`mb-2 rounded-lg w-full cursor-pointer flex-shrink-0 ${
                  activeLink === item.name ? "bg-green-600" : "bg-green-800"
                }`}
              >
                <Link
                  to={item.path}
                  onClick={() => handleLinkClick(item.name)}
                  className="block w-full p-2 capitalize text-white"
                >
                  {item.name}
                </Link>
              </li>
            ))}
        </ul>

        {/* Logout button fixed bottom */}
        <div className="mt-auto pt-4 pb-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-700 hover:bg-red-600 cursor-pointer rounded-lg p-2 text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;
