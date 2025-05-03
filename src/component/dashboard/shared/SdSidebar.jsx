import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AiOutlineInteraction } from "react-icons/ai";
import { CiChat2, CiSquareQuestion, CiUser, CiViewBoard } from "react-icons/ci";
import { FaHome, FaChevronDown, FaChevronUp, FaBlog } from "react-icons/fa";
import {
  MdFeedback,
  MdHistory,
  MdManageAccounts,
  MdOutlineDashboard,
  MdTipsAndUpdates,
} from "react-icons/md";
import { RiAuctionLine } from "react-icons/ri";
import { TfiAnnouncement } from "react-icons/tfi";
import { ImHammer2 } from "react-icons/im";
import { BiCategory } from "react-icons/bi";
import { TbMessageReport } from "react-icons/tb";
import {
  IoChatbubbleEllipsesOutline,
  IoSettingsOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { AuthContexts } from "../../../providers/AuthProvider";
import ThemeContext from "../../Context/ThemeContext";

const Sidebar = () => {
  const { user, dbUser } = useContext(AuthContexts);
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const isAdmin = dbUser?.role === "admin";
  const isSeller = dbUser?.role === "seller";
  const isBuyer = dbUser?.role === "buyer";

  // State for dropdowns
  const [openDropdown, setOpenDropdown] = useState({
    dashboard: false,
    inbox: false,
    auctions: false,
    updates: false,
    management: false,
    buyerAuction: false,
  });

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  // Role-based colors
  const roleColors = {
    admin: {
      primary: isDarkMode ? "indigo" : "indigo",
      secondary: isDarkMode ? "purple" : "purple",
      text: isDarkMode ? "indigo-100" : "indigo-800",
      icon: isDarkMode ? "indigo-300" : "indigo-700",
      hover: isDarkMode ? "indigo-800/40" : "indigo-100",
      active: isDarkMode ? "purple-300/50" : "purple-200/70",
    },
    seller: {
      primary: isDarkMode ? "amber" : "amber",
      secondary: isDarkMode ? "orange" : "orange",
      text: isDarkMode ? "amber-100" : "amber-800",
      icon: isDarkMode ? "amber-300" : "amber-700",
      hover: isDarkMode ? "amber-800/40" : "amber-100",
      active: isDarkMode ? "orange-300/50" : "orange-200/70",
    },
    buyer: {
      primary: isDarkMode ? "emerald" : "blue",
      secondary: isDarkMode ? "teal" : "sky",
      text: isDarkMode ? "emerald-100" : "blue-700",
      icon: isDarkMode ? "emerald-300" : "blue-700",
      hover: isDarkMode ? "emerald-800/40" : "blue-100",
      active: isDarkMode ? "teal-300/50" : "teal-200/70",
    },
    common: {
      text: isDarkMode ? "gray-100" : "gray-800",
      icon: isDarkMode ? "gray-300" : "gray-700",
      hover: isDarkMode ? "gray-800/40" : "gray-200",
      active: isDarkMode ? "purple-300/50" : "purple-200/70",
    },
  };

  const colors = isAdmin
    ? roleColors.admin
    : isSeller
    ? roleColors.seller
    : isBuyer
    ? roleColors.buyer
    : roleColors.common;

  return (
    <div className="drawer-side fixed z-20">
      <label htmlFor="my-drawer-2" className="drawer-overlay lg:hidden"></label>

      <div
        className={`menu min-h-full w-64 p-6 sm:p-4 shadow-xl transition-colors duration-300 ${
          isDarkMode
            ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white"
            : "bg-gradient-to-b from-violet-50 to-violet-100 text-gray-800"
        }`}
      >
        {/* Logo and Title */}
        <div
          className="flex items-center gap-3 mb-8 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:rotate-12 ${
              isDarkMode ? "bg-white/90" : "bg-indigo-100"
            }`}
          >
            <ImHammer2 className={`text-${colors.primary}-600 text-xl`} />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-400 hover:scale-105 transition-transform">
            Rex-Auction
          </h1>
        </div>

        {/* User Profile Card */}
        <div
          className={`rounded-xl p-4 mb-8 backdrop-blur-sm  transition-all hover:shadow-xl ${
            isDarkMode
              ? `bg-${colors.primary}-800/50 border-b border-${colors.primary}-700/50 hover:border-${colors.primary}-500/50`
              : `bg-white/80 border border-${colors.primary}-200/50 hover:border-${colors.primary}-300/50`
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                className="w-12 h-12 rounded-full border-2 border-pink-400 p-0.5 hover:scale-110 transition-transform"
                src={
                  user?.photoURL ||
                  "https://i.ibb.co.com/Y75m1Mk9/Final-Boss.jpg"
                }
                alt="User"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                  isDarkMode ? "border-gray-900" : "border-white"
                } ${
                  dbUser?.status === "active" ? "bg-green-500" : "bg-yellow-500"
                }`}
              ></div>
            </div>
            <div>
              <p
                className={`font-bold text-sm ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {user?.displayName || "User"}
              </p>
              <div className="flex gap-1 items-center">
                <span
                  className={`inline-block px-2 py-0.5 bg-gradient-to-r from-${
                    colors.primary
                  }-500 to-${colors.secondary}-500 rounded-full ${
                    isDarkMode ? " text-white" : "text-black"
                  } text-xs font-semibold mt-1 capitalize`}
                >
                  {dbUser?.role || "Guest"}
                </span>
                <span
                  className={`text-xs opacity-70 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  v1.2.0
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links Section */}
        <div className="space-y-1 flex-1 ">
          {/* Admin Navigation Links */}
          {isAdmin && (
            <div className="space-y-1">
              <p
                className={`text-xs font-semibold uppercase tracking-wider mb-2 pl-2 text-${colors.icon}`}
              >
                Admin Controls
              </p>

              {/* Dashboard Dropdown */}
              <div>
                <button
                  onClick={() => toggleDropdown("dashboard")}
                  className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-${colors.hover} text-${colors.text}`}
                >
                  <div className="flex items-center gap-3">
                    <MdOutlineDashboard
                      size={20}
                      className={`text-${colors.icon}`}
                    />
                    <span>Dashboard</span>
                  </div>
                  {openDropdown.dashboard ? (
                    <FaChevronUp size={14} className={`text-${colors.icon}`} />
                  ) : (
                    <FaChevronDown
                      size={14}
                      className={`text-${colors.icon}`}
                    />
                  )}
                </button>
                {openDropdown.dashboard && (
                  <div className="ml-4 space-y-1 mt-1">
                    <NavLink
                      to="/dashboard"
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <CiViewBoard
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Overview</span>
                    </NavLink>

                    <NavLink
                      to="/dashboard/blog"
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <FaBlog size={18} className={`text-${colors.icon}`} />
                      <span>Blog</span>
                    </NavLink>
                    <NavLink
                      to="/dashboard/sharedPayment"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <IoWalletOutline
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Payment</span>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Inbox Dropdown */}
              <div>
                <button
                  onClick={() => toggleDropdown("inbox")}
                  className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-${colors.hover} text-${colors.text}`}
                >
                  <div className="flex items-center gap-3">
                    <CiChat2 size={20} className={`text-${colors.icon}`} />
                    <span>Inbox</span>
                  </div>
                  {openDropdown.inbox ? (
                    <FaChevronUp size={14} className={`text-${colors.icon}`} />
                  ) : (
                    <FaChevronDown
                      size={14}
                      className={`text-${colors.icon}`}
                    />
                  )}
                </button>
                {openDropdown.inbox && (
                  <div className="ml-4 space-y-1 mt-1">
                    <NavLink
                      to="/dashboard/chat"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <IoChatbubbleEllipsesOutline
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Chats</span>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Management Dropdown */}
              <div>
                <button
                  onClick={() => toggleDropdown("management")}
                  className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-${colors.hover} text-${colors.text}`}
                >
                  <div className="flex items-center gap-3">
                    <MdManageAccounts
                      size={20}
                      className={`text-${colors.icon}`}
                    />
                    <span>Management</span>
                  </div>
                  {openDropdown.management ? (
                    <FaChevronUp size={14} className={`text-${colors.icon}`} />
                  ) : (
                    <FaChevronDown
                      size={14}
                      className={`text-${colors.icon}`}
                    />
                  )}
                </button>
                {openDropdown.management && (
                  <div className="ml-4 space-y-1 mt-1">
                    <NavLink
                      to="/dashboard/userManagement"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <CiUser size={18} className={`text-${colors.icon}`} />
                      <span>User Management</span>
                    </NavLink>
                    <NavLink
                      to="/dashboard/sellerRequest"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <AiOutlineInteraction
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Seller Requests</span>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Auctions Dropdown */}
              <div>
                <button
                  onClick={() => toggleDropdown("auctions")}
                  className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-${colors.hover} text-${colors.text}`}
                >
                  <div className="flex items-center gap-3">
                    <ImHammer2 size={20} className={`text-${colors.icon}`} />
                    <span>Auctions</span>
                  </div>
                  {openDropdown.auctions ? (
                    <FaChevronUp size={14} className={`text-${colors.icon}`} />
                  ) : (
                    <FaChevronDown
                      size={14}
                      className={`text-${colors.icon}`}
                    />
                  )}
                </button>
                {openDropdown.auctions && (
                  <div className="ml-4 space-y-1 mt-1">
                    <NavLink
                      to="/dashboard/manageAuctions"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <MdManageAccounts
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Auction Management</span>
                    </NavLink>
                    <NavLink
                      to="/dashboard/endedAuctions"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <BiCategory size={18} className={`text-${colors.icon}`} />
                      <span>Ended Auctions</span>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Updates Dropdown */}
              <div>
                <button
                  onClick={() => toggleDropdown("updates")}
                  className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-${colors.hover} text-${colors.text}`}
                >
                  <div className="flex items-center gap-3">
                    <MdTipsAndUpdates
                      size={20}
                      className={`text-${colors.icon}`}
                    />
                    <span>Updates</span>
                  </div>
                  {openDropdown.updates ? (
                    <FaChevronUp size={14} className={`text-${colors.icon}`} />
                  ) : (
                    <FaChevronDown
                      size={14}
                      className={`text-${colors.icon}`}
                    />
                  )}
                </button>
                {openDropdown.updates && (
                  <div className="ml-4 space-y-1 mt-1">
                    <NavLink
                      to="/dashboard/createAnnouncement"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <TfiAnnouncement
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Create Announcement</span>
                    </NavLink>
                    <NavLink
                      to="/dashboard/feedback"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <MdFeedback size={18} className={`text-${colors.icon}`} />
                      <span>Feedback</span>
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Seller Navigation Links */}
          {isSeller && (
            <div className="space-y-1">
              <p
                className={`text-xs font-semibold uppercase tracking-wider mb-2 pl-2 text-${colors.icon}`}
              >
                Seller Dashboard
              </p>

              {/* Dashboard Dropdown */}
              <div>
                <button
                  onClick={() => toggleDropdown("dashboard")}
                  className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-${colors.hover} text-${colors.text}`}
                >
                  <div className="flex items-center gap-3">
                    <MdOutlineDashboard
                      size={20}
                      className={`text-${colors.icon}`}
                    />
                    <span>Dashboard</span>
                  </div>
                  {openDropdown.dashboard ? (
                    <FaChevronUp size={14} className={`text-${colors.icon}`} />
                  ) : (
                    <FaChevronDown
                      size={14}
                      className={`text-${colors.icon}`}
                    />
                  )}
                </button>
                {openDropdown.dashboard && (
                  <div className="ml-4 space-y-1 mt-1">
                    <NavLink
                      to="/dashboard"
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <CiViewBoard
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Overview</span>
                    </NavLink>
                    <NavLink
                      to="/dashboard/blog"
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <FaBlog size={18} className={`text-${colors.icon}`} />
                      <span>Blog</span>
                    </NavLink>
                    <NavLink
                      to="/dashboard/sharedPayment"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <IoWalletOutline
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Payment</span>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Inbox Dropdown */}
              <div>
                <button
                  onClick={() => toggleDropdown("inbox")}
                  className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-${colors.hover} text-${colors.text}`}
                >
                  <div className="flex items-center gap-3">
                    <CiChat2 size={20} className={`text-${colors.icon}`} />
                    <span>Inbox</span>
                  </div>
                  {openDropdown.inbox ? (
                    <FaChevronUp size={14} className={`text-${colors.icon}`} />
                  ) : (
                    <FaChevronDown
                      size={14}
                      className={`text-${colors.icon}`}
                    />
                  )}
                </button>
                {openDropdown.inbox && (
                  <div className="ml-4 space-y-1 mt-1">
                    <NavLink
                      to="/dashboard/chat"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <IoChatbubbleEllipsesOutline
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Chats</span>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Auctions Dropdown */}
              <div>
                <button
                  onClick={() => toggleDropdown("auctions")}
                  className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-${colors.hover} text-${colors.text}`}
                >
                  <div className="flex items-center gap-3">
                    <ImHammer2 size={20} className={`text-${colors.icon}`} />
                    <span>Auctions</span>
                  </div>
                  {openDropdown.auctions ? (
                    <FaChevronUp size={14} className={`text-${colors.icon}`} />
                  ) : (
                    <FaChevronDown
                      size={14}
                      className={`text-${colors.icon}`}
                    />
                  )}
                </button>
                {openDropdown.auctions && (
                  <div className="ml-4 space-y-1 mt-1">
                    <NavLink
                      to="/dashboard/createAuction"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <AiOutlineInteraction
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Create Auction</span>
                    </NavLink>
                    <NavLink
                      to="/dashboard/manageAuctions"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <MdManageAccounts
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Manage Auction</span>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Updates Dropdown */}
              <div>
                <button
                  onClick={() => toggleDropdown("updates")}
                  className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-${colors.hover} text-${colors.text}`}
                >
                  <div className="flex items-center gap-3">
                    <MdTipsAndUpdates
                      size={20}
                      className={`text-${colors.icon}`}
                    />
                    <span>Updates</span>
                  </div>
                  {openDropdown.updates ? (
                    <FaChevronUp size={14} className={`text-${colors.icon}`} />
                  ) : (
                    <FaChevronDown
                      size={14}
                      className={`text-${colors.icon}`}
                    />
                  )}
                </button>
                {openDropdown.updates && (
                  <div className="ml-4 space-y-1 mt-1">
                    <NavLink
                      to="/dashboard/announcement"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <TfiAnnouncement
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Announcements</span>
                    </NavLink>
                    <NavLink
                      to="/dashboard/reports"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <TbMessageReport
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Reports</span>
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Buyer Navigation Links */}
          {isBuyer && (
            <div className="space-y-1">
              <p
                className={`text-xs font-semibold uppercase tracking-wider mb-2 pl-2 text-${colors.icon}`}
              >
                Buyer Dashboard
              </p>

              {/* Dashboard Dropdown */}
              <div>
                <button
                  onClick={() => toggleDropdown("dashboard")}
                  className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-${colors.hover} text-${colors.text}`}
                >
                  <div className="flex items-center gap-3">
                    <MdOutlineDashboard
                      size={20}
                      className={`text-${colors.icon}`}
                    />
                    <span>Dashboard</span>
                  </div>
                  {openDropdown.dashboard ? (
                    <FaChevronUp size={14} className={`text-${colors.icon}`} />
                  ) : (
                    <FaChevronDown
                      size={14}
                      className={`text-${colors.icon}`}
                    />
                  )}
                </button>
                {openDropdown.dashboard && (
                  <div className="ml-4 space-y-1 mt-1">
                    <NavLink
                      to="/dashboard"
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <CiViewBoard
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Overview</span>
                    </NavLink>
                    <NavLink
                      to="/dashboard/blog"
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <FaBlog size={18} className={`text-${colors.icon}`} />
                      <span>Blog</span>
                    </NavLink>
                    <NavLink
                      to="/dashboard/sharedPayment"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <IoWalletOutline
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Payment</span>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Inbox Dropdown */}
              <div>
                <button
                  onClick={() => toggleDropdown("inbox")}
                  className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-${colors.hover} text-${colors.text}`}
                >
                  <div className="flex items-center gap-3">
                    <CiChat2 size={20} className={`text-${colors.icon}`} />
                    <span>Inbox</span>
                  </div>
                  {openDropdown.inbox ? (
                    <FaChevronUp size={14} className={`text-${colors.icon}`} />
                  ) : (
                    <FaChevronDown
                      size={14}
                      className={`text-${colors.icon}`}
                    />
                  )}
                </button>
                {openDropdown.inbox && (
                  <div className="ml-4 space-y-1 mt-1">
                    <NavLink
                      to="/dashboard/chat"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <IoChatbubbleEllipsesOutline
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Chats</span>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Auction Activities Dropdown */}
              <div>
                <button
                  onClick={() => toggleDropdown("buyerAuction")}
                  className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-${colors.hover} text-${colors.text}`}
                >
                  <div className="flex items-center gap-3">
                    <RiAuctionLine
                      size={20}
                      className={`text-${colors.icon}`}
                    />
                    <span>Auction Activities</span>
                  </div>
                  {openDropdown.buyerAuction ? (
                    <FaChevronUp size={14} className={`text-${colors.icon}`} />
                  ) : (
                    <FaChevronDown
                      size={14}
                      className={`text-${colors.icon}`}
                    />
                  )}
                </button>
                {openDropdown.buyerAuction && (
                  <div className="ml-4 space-y-1 mt-1">
                    <NavLink
                      to="/dashboard/status"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <RiAuctionLine
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Auction Status</span>
                    </NavLink>
                    <NavLink
                      to="/dashboard/bidHistory"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <MdHistory size={18} className={`text-${colors.icon}`} />
                      <span>Bid History</span>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Updates Dropdown */}
              <div>
                <button
                  onClick={() => toggleDropdown("updates")}
                  className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-${colors.hover} text-${colors.text}`}
                >
                  <div className="flex items-center gap-3">
                    <MdTipsAndUpdates
                      size={20}
                      className={`text-${colors.icon}`}
                    />
                    <span>Updates</span>
                  </div>
                  {openDropdown.updates ? (
                    <FaChevronUp size={14} className={`text-${colors.icon}`} />
                  ) : (
                    <FaChevronDown
                      size={14}
                      className={`text-${colors.icon}`}
                    />
                  )}
                </button>
                {openDropdown.updates && (
                  <div className="ml-4 space-y-1 mt-1">
                    <NavLink
                      to="/dashboard/announcement"
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                          isActive
                            ? `bg-${colors.active} ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              } font-bold`
                            : `hover:bg-${colors.hover} text-${colors.text}`
                        }`
                      }
                    >
                      <TfiAnnouncement
                        size={18}
                        className={`text-${colors.icon}`}
                      />
                      <span>Announcements</span>
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink
                to="/dashboard/becomeSeller"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                    isActive
                      ? `bg-${colors.active} ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        } font-bold`
                      : `hover:bg-${colors.hover} text-${colors.text}`
                  }`
                }
              >
                <CiSquareQuestion size={20} className={`text-${colors.icon}`} />
                <span>Become Seller</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Common Links for All Users */}
        <div
          className={`mt-6 pt-6 border-t ${
            isDarkMode ? "border-indigo-700/50" : "border-indigo-200/50"
          }`}
        >
          <p
            className={`text-xs font-semibold uppercase tracking-wider mb-2 pl-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Common
          </p>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                isActive
                  ? `bg-${roleColors.common.active} ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    } font-bold`
                  : `hover:bg-${roleColors.common.hover} text-${roleColors.common.text}`
              }`
            }
          >
            <FaHome size={20} className={`text-${roleColors.common.icon}`} />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                isActive
                  ? `bg-${roleColors.common.active} ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    } font-bold`
                  : `hover:bg-${roleColors.common.hover} text-${roleColors.common.text}`
              }`
            }
          >
            <IoSettingsOutline
              size={20}
              className={`text-${roleColors.common.icon}`}
            />
            <span>Settings</span>
          </NavLink>
        </div>

        {/* Version Info */}
        <div
          className={`mt-auto pt-6 text-center text-xs ${
            isDarkMode ? "text-indigo-300/70" : "text-indigo-600/70"
          }`}
        >
          <p>Rex-Auction v1.2.0</p>
          <p className="text-[10px] mt-1">© 2023 All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
