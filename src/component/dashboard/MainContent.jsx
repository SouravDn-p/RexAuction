import { FaBars } from "react-icons/fa";
import { Outlet, useLocation } from "react-router-dom";
import AdminDashboard from "./admin/AdminDashboard";
import SellerDashboard from "./seller/SellerDashboard";
import BuyerDashboard from "./buyer/BuyerDashboard";

const MainContent = ({ isSeller, isAdmin }) => {
  const location = useLocation();

  return (
    <div className="drawer-content flex flex-col  md:flex-row justify-between items-stretch">
      {/* Hamburger Menu for Small Devices */}
      <label
        htmlFor="my-drawer-2"
        className="mt-3 ml-5 text-purple-600 bg-purple-300 h-10 w-10 p-2 rounded-full drawer-button lg:hidden"
      >
        <FaBars size={24} />
      </label>

      {/* Content Container */}
      <div className="container mx-auto   ">
        <div className="bg-white rounded-lg   overflow-x-auto flex-grow">
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
