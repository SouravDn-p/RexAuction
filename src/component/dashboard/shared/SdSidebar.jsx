"use client";

import { AiOutlineInteraction } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { CiSquareQuestion, CiUser } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import {
  MdFeedback,
  MdHistory,
  MdManageAccounts,
  MdOutlineDashboard,
} from "react-icons/md";
import { RiAuctionLine } from "react-icons/ri";
import { TfiAnnouncement } from "react-icons/tfi";
import { NavLink } from "react-router-dom";
import { ImHammer2 } from "react-icons/im";
import { BiCategory } from "react-icons/bi";
import { TbMessageReport } from "react-icons/tb";
import { useContext } from "react";
import {
  IoChatbubbleEllipsesOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { AuthContexts } from "../../../providers/AuthProvider";
import ThemeContext from "../../Context/ThemeContext";

const Sidebar = () => {
  const { user, dbUser } = useContext(AuthContexts);
  const { isDarkMode } = useContext(ThemeContext);
  const isAdmin = dbUser?.role === "admin";
  const isSeller = dbUser?.role === "seller";
  const isBuyer = dbUser?.role === "buyer";

  return (
    <div className="drawer-side fixed z-20">
      <label htmlFor="my-drawer-2" className="drawer-overlay lg:hidden"></label>

      <div
        className={`menu min-h-full w-64 p-6 shadow-xl ${
          isDarkMode
            ? "bg-gradient-to-b from-gray-900 to-purple-900 text-white"
            : "bg-gradient-to-b from-violet-50 to-violet-100 text-gray-800"
        }`}
      >
        {/* Logo and Title with animation */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className={`w-10 h-10 ${
              isDarkMode ? "bg-white" : "bg-indigo-100"
            } rounded-full flex items-center justify-center`}
          >
            <ImHammer2 className="text-indigo-900 text-xl animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-400">
            Rex-Auction
          </h1>
        </div>

        {/* User Profile Card */}
        <div
          className={`rounded-xl p-4 mb-8 backdrop-blur-sm shadow-lg ${
            isDarkMode
              ? "bg-indigo-800/50 border border-indigo-700/50"
              : "bg-white/80 border border-indigo-200/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              className="w-12 h-12 rounded-full border-2 border-pink-400 p-0.5"
              src={
                user?.photoURL || "https://i.ibb.co.com/Y75m1Mk9/Final-Boss.jpg"
              }
              alt=""
            />
            <div>
              <p
                className={`font-bold text-sm ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {user?.displayName || "User"}
              </p>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-indigo-200" : "text-indigo-600"
                }`}
              >
                <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white text-xs font-semibold mt-1 capitalize">
                  {dbUser?.role || "Guest"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links Section */}
        <div className="space-y-1">
          {/* Admin Navigation Links */}
          {isAdmin && (
            <div className="space-y-1">
              <p
                className={`text-xs font-semibold uppercase tracking-wider mb-2 pl-2 ${
                  isDarkMode ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                Admin Controls
              </p>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-indigo-700/60 text-white font-bold shadow-md"
                        : "bg-indigo-200 text-indigo-900 font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-indigo-800/40 text-indigo-100"
                      : "hover:bg-indigo-100 text-indigo-800"
                  }`
                }
              >
                <MdOutlineDashboard
                  size={20}
                  className={`${
                    isDarkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-indigo-100" : "text-indigo-800"
                  }`}
                >
                  Dashboard
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/chat"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-indigo-700/60 text-white font-bold shadow-md"
                        : "bg-indigo-200 text-indigo-900 font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-indigo-800/40 text-indigo-100"
                      : "hover:bg-indigo-100 text-indigo-800"
                  }`
                }
              >
                <IoChatbubbleEllipsesOutline
                  size={20}
                  className={`${
                    isDarkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-indigo-100" : "text-indigo-800"
                  }`}
                >
                  Chats
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/userManagement"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-indigo-700/60 text-white font-bold shadow-md"
                        : "bg-indigo-200 text-indigo-900 font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-indigo-800/40 text-indigo-100"
                      : "hover:bg-indigo-100 text-indigo-800"
                  }`
                }
              >
                <CiUser
                  size={20}
                  className={`${
                    isDarkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-indigo-100" : "text-indigo-800"
                  }`}
                >
                  User Management
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/sellerRequest"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-indigo-700/60 text-white font-bold shadow-md"
                        : "bg-indigo-200 text-indigo-900 font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-indigo-800/40 text-indigo-100"
                      : "hover:bg-indigo-100 text-indigo-800"
                  }`
                }
              >
                <CiUser
                  size={20}
                  className={`${
                    isDarkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-indigo-100" : "text-indigo-800"
                  }`}
                >
                  Seller Request
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/manageAuctions"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-indigo-700/60 text-white font-bold shadow-md"
                        : "bg-indigo-200 text-indigo-900 font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-indigo-800/40 text-indigo-100"
                      : "hover:bg-indigo-100 text-indigo-800"
                  }`
                }
              >
                <ImHammer2
                  size={18}
                  className={`${
                    isDarkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-indigo-100" : "text-indigo-800"
                  }`}
                >
                  Auction Management
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/endedAuctions"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-indigo-700/60 text-white font-bold shadow-md"
                        : "bg-indigo-200 text-indigo-900 font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-indigo-800/40 text-indigo-100"
                      : "hover:bg-indigo-100 text-indigo-800"
                  }`
                }
              >
                <BiCategory
                  size={20}
                  className={`${
                    isDarkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-indigo-100" : "text-indigo-800"
                  }`}
                >
                  Ended Auctions History
                </span>
              </NavLink>

              <NavLink
                to="/dashboard/createAnnouncement"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-indigo-700/60 text-white font-bold shadow-md"
                        : "bg-indigo-200 text-indigo-900 font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-indigo-800/40 text-indigo-100"
                      : "hover:bg-indigo-100 text-indigo-800"
                  }`
                }
              >
                <TfiAnnouncement
                  size={18}
                  className={`${
                    isDarkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-indigo-100" : "text-indigo-800"
                  }`}
                >
                  Create Announcement
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/feedback"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-indigo-700/60 text-white font-bold shadow-md"
                        : "bg-indigo-200 text-indigo-900 font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-indigo-800/40 text-indigo-100"
                      : "hover:bg-indigo-100 text-indigo-800"
                  }`
                }
              >
                <MdFeedback
                  size={18}
                  className={`${
                    isDarkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-indigo-100" : "text-indigo-800"
                  }`}
                >
                  FeedBacks
                </span>
              </NavLink>
            </div>
          )}

          {/* Seller Navigation Links */}
          {isSeller && (
            <div className="space-y-1">
              <p
                className={`text-xs font-semibold uppercase tracking-wider mb-2 pl-2 ${
                  isDarkMode ? "text-amber-300" : "text-amber-700"
                }`}
              >
                Seller Dashboard
              </p>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-amber-700/60 text-white font-bold shadow-md"
                        : "bg-amber-200 text-amber-900 font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-amber-800/40 text-amber-100"
                      : "hover:bg-amber-100 text-amber-800"
                  }`
                }
              >
                <MdOutlineDashboard
                  size={20}
                  className={`${
                    isDarkMode ? "text-amber-300" : "text-amber-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-amber-100" : "text-amber-800"
                  }`}
                >
                  Dashboard
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/chat"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-indigo-700/60 text-white font-bold shadow-md"
                        : "bg-indigo-200 text-indigo-900 font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-indigo-800/40 text-indigo-100"
                      : "hover:bg-indigo-100 text-indigo-800"
                  }`
                }
              >
                <IoChatbubbleEllipsesOutline
                  size={20}
                  className={`${
                    isDarkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-indigo-100" : "text-indigo-800"
                  }`}
                >
                  Chats
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/announcement"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-amber-700/60 text-white font-bold shadow-md"
                        : "bg-amber-200 text-amber-900 font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-amber-800/40 text-amber-100"
                      : "hover:bg-amber-100 text-amber-800"
                  }`
                }
              >
                <TfiAnnouncement
                  size={18}
                  className={`${
                    isDarkMode ? "text-amber-300" : "text-amber-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-amber-100" : "text-amber-800"
                  }`}
                >
                  Announcements
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/createAuction"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-amber-700/60 text-white font-bold shadow-md"
                        : "bg-amber-200 text-amber-900 font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-amber-800/40 text-amber-100"
                      : "hover:bg-amber-100 text-amber-800"
                  }`
                }
              >
                <AiOutlineInteraction
                  size={20}
                  className={`${
                    isDarkMode ? "text-amber-300" : "text-amber-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-amber-100" : "text-amber-800"
                  }`}
                >
                  Create Auction
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/manageAuctions"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-amber-700/60 text-white font-bold shadow-md"
                        : "bg-amber-200 text-amber-900 font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-amber-800/40 text-amber-100"
                      : "hover:bg-amber-100 text-amber-800"
                  }`
                }
              >
                <MdManageAccounts
                  size={20}
                  className={`${
                    isDarkMode ? "text-amber-300" : "text-amber-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-amber-100" : "text-amber-800"
                  }`}
                >
                  Manage Auction
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/reports"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-indigo-700/60 text-white font-bold shadow-md"
                        : "bg-indigo-200 text-indigo-900 font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-indigo-800/40 text-indigo-100"
                      : "hover:bg-indigo-100 text-indigo-800"
                  }`
                }
              >
                <TbMessageReport
                  size={20}
                  className={`${
                    isDarkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-indigo-100" : "text-indigo-800"
                  }`}
                >
                  Reports
                </span>
              </NavLink>
            </div>
          )}

          {/* Buyer Navigation Links */}
          {isBuyer && (
            <div className="space-y-1">
              <p
                className={`text-xs font-semibold uppercase tracking-wider mb-2 pl-2 ${
                  isDarkMode ? "text-emerald-300" : "text-blue-600"
                }`}
              >
                Buyer Dashboard
              </p>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-emerald-700/60 text-white font-bold shadow-md"
                        : "bg-blue-500 text-white font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-emerald-800/40 text-emerald-100"
                      : "hover:bg-blue-400 text-white"
                  }`
                }
              >
                <MdOutlineDashboard
                  size={20}
                  className={`${
                    isDarkMode ? "text-emerald-300" : "text-blue-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-emerald-300" : "text-blue-700"
                  }`}
                >
                  Dashboard
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/chat"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-indigo-700/60 text-white font-bold shadow-md"
                        : "bg-indigo-200 text-indigo-900 font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-indigo-800/40 text-indigo-100"
                      : "hover:bg-indigo-100 text-indigo-800"
                  }`
                }
              >
                <IoChatbubbleEllipsesOutline
                  size={20}
                  className={`${
                    isDarkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-indigo-100" : "text-indigo-800"
                  }`}
                >
                  Chats
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/status"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-emerald-700/60 text-white font-bold shadow-md"
                        : "bg-blue-500 text-white font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-emerald-800/40 text-emerald-100"
                      : "hover:bg-blue-400 text-white"
                  }`
                }
              >
                <RiAuctionLine
                  size={20}
                  className={`${
                    isDarkMode ? "text-emerald-300" : "text-blue-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-emerald-300" : "text-blue-700"
                  }`}
                >
                  Auction Status
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/bidHistory"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-emerald-700/60 text-white font-bold shadow-md"
                        : "bg-blue-500 text-white font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-emerald-800/40 text-emerald-100"
                      : "hover:bg-blue-400 text-white"
                  }`
                }
              >
                <MdHistory
                  size={20}
                  className={`${
                    isDarkMode ? "text-emerald-300" : "text-blue-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-emerald-300" : "text-blue-700"
                  }`}
                >
                  Bid History
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/payment"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-emerald-700/60 text-white font-bold shadow-md"
                        : "bg-blue-500 text-white font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-emerald-800/40 text-emerald-100"
                      : "hover:bg-blue-400 text-white"
                  }`
                }
              >
                <CgProfile
                  size={20}
                  className={`${
                    isDarkMode ? "text-emerald-300" : "text-blue-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-emerald-300" : "text-blue-700"
                  }`}
                >
                  Payment
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/announcement"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-emerald-700/60 text-white font-bold shadow-md"
                        : "bg-blue-500 text-white font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-emerald-800/40 text-emerald-100"
                      : "hover:bg-blue-400 text-white"
                  }`
                }
              >
                <TfiAnnouncement
                  size={18}
                  className={`${
                    isDarkMode ? "text-emerald-300" : "text-blue-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-emerald-300" : "text-blue-700"
                  }`}
                >
                  Announcements
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/createAuction"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-emerald-700/60 text-white font-bold shadow-md"
                        : "bg-blue-500 text-white font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-emerald-800/40 text-emerald-100"
                      : "hover:bg-blue-400 text-white"
                  }`
                }
              >
                <AiOutlineInteraction
                  size={20}
                  className={`${
                    isDarkMode ? "text-emerald-300" : "text-blue-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-emerald-300" : "text-blue-700"
                  }`}
                >
                  Create Auction
                </span>
              </NavLink>
              <NavLink
                to="/dashboard/becomeSeller"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? "bg-emerald-700/60 text-white font-bold shadow-md"
                        : "bg-blue-500 text-white font-bold shadow-md"
                      : isDarkMode
                      ? "hover:bg-emerald-800/40 text-emerald-100"
                      : "hover:bg-blue-400 text-white"
                  }`
                }
              >
                <CiSquareQuestion
                  size={20}
                  className={`${
                    isDarkMode ? "text-emerald-300" : "text-blue-700"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-emerald-300" : "text-blue-700"
                  }`}
                >
                  Become Seller
                </span>
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
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? isDarkMode
                    ? "bg-gray-700/60 text-white font-bold shadow-md"
                    : "bg-gray-300 text-gray-900 font-bold shadow-md"
                  : isDarkMode
                  ? "hover:bg-gray-800/40 text-gray-100"
                  : "hover:bg-gray-200 text-gray-800"
              }`
            }
          >
            <CgProfile
              size={20}
              className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            />
            <span
              className={`${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
            >
              Profile
            </span>
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? isDarkMode
                    ? "bg-gray-700/60 text-white font-bold shadow-md"
                    : "bg-gray-300 text-gray-900 font-bold shadow-md"
                  : isDarkMode
                  ? "hover:bg-gray-800/40 text-gray-100"
                  : "hover:bg-gray-200 text-gray-800"
              }`
            }
          >
            <FaHome
              size={20}
              className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            />
            <span
              className={`${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
            >
              Home
            </span>
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? isDarkMode
                    ? "bg-gray-700/60 text-white font-bold shadow-md"
                    : "bg-gray-300 text-gray-900 font-bold shadow-md"
                  : isDarkMode
                  ? "hover:bg-gray-800/40 text-gray-100"
                  : "hover:bg-gray-200 text-gray-800"
              }`
            }
          >
            <IoSettingsOutline
              size={20}
              className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            />
            <span
              className={`${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
            >
              Settings
            </span>
          </NavLink>
        </div>

        {/* Version Info */}
        <div
          className={`mt-auto pt-6 text-center text-xs ${
            isDarkMode ? "text-indigo-300/70" : "text-indigo-600/70"
          }`}
        >
          <p>Rex-Auction v1.2.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
