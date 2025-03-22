import { AiOutlineInteraction } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { CiSquareQuestion, CiUser } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { MdHistory, MdOutlineDashboard } from "react-icons/md";
import { RiAuctionLine } from "react-icons/ri";
import { TfiAnnouncement } from "react-icons/tfi";
import { NavLink } from "react-router-dom";
import { ImHammer2 } from "react-icons/im";
import { BiCategory } from "react-icons/bi";
import { TbMessageReport } from "react-icons/tb";
import { GrAnnounce } from "react-icons/gr";
import { useContext } from "react";
import { AuthContexts } from "../../providers/AuthProvider";
import { IoSettingsOutline } from "react-icons/io5";

const Sidebar = () => {
  const { user } = useContext(AuthContexts);
  const isAdmin = false;
  const isSeller = false;

  return (
    <div className="drawer-side fixed">
      <label htmlFor="my-drawer-2" className="drawer-overlay lg:hidden"></label>

      <div className="menu bg-gray-900 text-white min-h-full w-60 p-6">
        <h1 className="md:text-2xl text-xl font-bold py-2">Rex-Auction</h1>

        {/* Admin Sidebar Items */}
        {isAdmin && (
          <>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-blue-400" : ""
                }`
              }
            >
              <MdOutlineDashboard size={20} /> Dashboard
            </NavLink>
            <NavLink
              to="/dashboard/userManagement"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-blue-400" : ""
                }`
              }
            >
              <CiUser size={20} /> User Management
            </NavLink>
            <NavLink
              to="/dashboard/createAnnouncement"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-blue-400" : ""
                }`
              }
            >
              <ImHammer2 size={20} /> Auction Management
            </NavLink>
            <NavLink
              to="/dashboard/createAnnouncement"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-blue-400" : ""
                }`
              }
            >
              <BiCategory size={20} /> Categories
            </NavLink>
            <NavLink
              to="/dashboard/createAnnouncement"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-blue-400" : ""
                }`
              }
            >
              <TbMessageReport size={20} /> Report
            </NavLink>
            <NavLink
              to="/dashboard/createAnnouncement"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-blue-400" : ""
                }`
              }
            >
              <TfiAnnouncement size={20} /> Create Announcement
            </NavLink>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-blue-400" : ""
                }`
              }
            >
              <CgProfile size={20} /> Profile
            </NavLink>
            <NavLink
              to="/dashboard/announcement"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-blue-400" : ""
                }`
              }
            >
              <GrAnnounce size={20} /> Announcement
            </NavLink>
          </>
        )}

        {/* Seller Sidebar Items */}
        {isSeller && !isAdmin && (
          <>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-blue-400" : ""
                }`
              }
            >
              <MdOutlineDashboard size={20} /> Dashboard
            </NavLink>
            <NavLink
              to="/dashboard/announcement"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-blue-400" : ""
                }`
              }
            >
              <TfiAnnouncement size={20} /> Announcement
            </NavLink>
            <NavLink
              to="/dashboard/createAction"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-blue-400" : ""
                }`
              }
            >
              <AiOutlineInteraction size={20} /> Create Action
            </NavLink>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-blue-400" : ""
                }`
              }
            >
              <CgProfile size={20} /> Profile
            </NavLink>
          </>
        )}

        {/* Buyer Sidebar Items */}
        {!isAdmin && !isSeller && (
          <>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-yellow-400" : ""
                }`
              }
            >
              <MdOutlineDashboard size={20} /> Dashboard
            </NavLink>
            <NavLink
              to="/dashboard/status"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-yellow-400" : ""
                }`
              }
            >
              <RiAuctionLine size={20} /> Auction Status
            </NavLink>
            <NavLink
              to="/dashboard/bidHistory"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-yellow-400" : ""
                }`
              }
            >
              <MdHistory size={20} /> Bid History
            </NavLink>
            <NavLink
              to="/dashboard/payment"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-yellow-400" : ""
                }`
              }
            >
              <CgProfile size={20} /> Payment
            </NavLink>
            <NavLink
              to="/dashboard/announcement"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-yellow-400" : ""
                }`
              }
            >
              <TfiAnnouncement size={20} /> Announcement
            </NavLink>
            <NavLink
              to="/dashboard/becomeSeller"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-yellow-400" : ""
                }`
              }
            >
              <CiSquareQuestion size={20} /> Become Seller
            </NavLink>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-yellow-400" : ""
                }`
              }
            >
              <CgProfile size={20} /> Profile
            </NavLink>
          </>
        )}

        {/* Home Link for All */}
        <div className=" h-[50vh] flex flex-col justify-between shadow-md p-4 ">
          <div className="border-t border-gray-700 mt-5 pt-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-yellow-400" : ""
                }`
              }
            >
              <FaHome size={20} /> Home
            </NavLink>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 font-bold ${
                  isActive ? "text-yellow-400" : ""
                }`
              }
            >
              <IoSettingsOutline size={20} /> Setting
            </NavLink>
          </div>
          <div className="flex gap-5 justify-center items-center">
            <img
              className="w-10 h-10 rounded-full"
              src={user.photoURL}
              alt=""
            />
            <div>
              <p className="font-bold text-xs ">
                Admin User: <span>{user.displayName}</span>
              </p>
              <p className="text-xs">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
