import React, { useState, useEffect } from "react";
import AdminSidebar from "../Admin/AdminSidbar";
import AdminNavbar from "../Admin/AdminNavbar";
import { Outlet, useLocation } from "react-router-dom";
import { adminMenuItems } from "./AdminMenu";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Dashboard");

  const location = useLocation();

  useEffect(() => {
    const currentItem = adminMenuItems.find(
      (item) => item.path === location.pathname,
    );
    if (currentItem) {
      setActiveLink(currentItem.name);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex flex-col text-white bg-gray-50 overflow-hidden">
      <AdminNavbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-green-800 overflow-y-auto text-white border-r border-zinc-700 transform transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static z-50`}
        >
          <AdminSidebar
            closeSidebar={closeSidebar}
            setActiveLink={setActiveLink}
            activeLink={activeLink}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden text-black">
          <div className="p-4 sm:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
