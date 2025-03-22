import { FaBars, FaSearch } from "react-icons/fa";
import { Outlet, useLocation } from "react-router-dom";
import AdminDashboard from "./admin/AdminDashboard";
import SellerDashboard from "./seller/SellerDashboard";
import BuyerDashboard from "./buyer/BuyerDashboard";
import { useState } from "react";
import DashboardNavbar from "./shared/DashboardNavbar";

const MainContent = () => {
  const isAdmin = false;
  const isSeller = false;
  const location = useLocation();

  // State for search input
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Mock user data (replace with actual user context or API call)
  const formData = {
    photoURL: "https://via.placeholder.com/150",
    name: "John Doe",
  };

  return (
    <div className="drawer-content flex flex-col md:flex-row justify-between items-stretch">
      {/* Hamburger Menu for Small Devices */}
      <label
        htmlFor="my-drawer-2"
        className="mt-3 ml-5 text-purple-600 bg-purple-300 h-10 w-10 p-2 rounded-full drawer-button lg:hidden"
      >
        <FaBars size={24} />
      </label>

      {/* Content Container */}
      <div className="container mx-auto">
        <div>
          <DashboardNavbar />
        </div>

        {/* Main Dashboard Content */}
        <div className="bg-white rounded-lg p-5 overflow-x-auto flex-grow">
          {location.pathname === "/dashboard" && (
            <>
              {isAdmin ? (
                <AdminDashboard />
              ) : isSeller ? (
                <SellerDashboard />
              ) : (
                <BuyerDashboard />
              )}
            </>
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
