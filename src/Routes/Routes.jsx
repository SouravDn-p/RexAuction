import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import AboutUs from "../component/AboutUs/AboutUs";
import LoginPage from "../Auth/LoginPage";
import ErrorPage from "../component/shared/ErrorPage";
import Register from "../Auth/Register";
import ForgotPass from "../Auth/ForgotPass";
import Auction from "../component/auction/Auction";
import Home from "../component/Home/Home";
import Announcement from "../component/dashboard/shared/Announcement";
import DashboardLayout from "../layout/DashboardLayout";
import Profile from "../component/dashboard/shared/Profile";
import LiveBid from "../component/auction/LiveBid";
import CreateAnnouncement from "../component/dashboard/admin/CreateAnnouncement";
import Payment from "../component/dashboard/buyer/Payment";
import BidHistory from "../component/dashboard/buyer/BidHistory";
import BuyerDetails from "../component/dashboard/admin/BuyerDetails";
import BecomeSeller from "../component/dashboard/buyer/BecomeSeller";
import CreateAuction from "../component/dashboard/seller/CreateAuction";
import AuctionStatus from "../component/dashboard/buyer/AuctionStatus";
import UserManagement from "../component/dashboard/admin/UserManagement";
import SellerRequest from "../component/dashboard/admin/SellerRequest";
import AnnouncementDetails from "../component/dashboard/shared/AnnouncementDetails";
import ManageAuctions from "../component/dashboard/shared/ManageAuctions";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/aboutUs",
        element: <AboutUs />,
      },
      {
        path: "/auction",
        element: <Auction />,
      },
      {
        path: "/liveBid",
        element: <LiveBid />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/profile",
        element: <Profile></Profile>,
      },
      {
        path: "/forgotPassword",
        element: <ForgotPass />,
      },
      {
        path: "announcementDetails/:id",
        element: <AnnouncementDetails />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      // Admin Only
      {
        index: true,
        element: <Profile />,
      },
      {
        path: "createAnnouncement",
        element: <CreateAnnouncement />,
      },
      {
        path: "buyerDetails",
        element: <BuyerDetails />,
      },
      {
        path: "userManagement",
        element: <UserManagement />,
      },
      {
        path: "manageAuctions",
        element: <ManageAuctions />,
      },
      {
        path: "sellerRequest",
        element: <SellerRequest />,
      },
      // Seller Only
      {
        path: "createAuction",
        element: <CreateAuction />,
      },

      // Buyer only
      {
        path: "bidHistory",
        element: <BidHistory />,
      },
      {
        path: "status",
        element: <AuctionStatus />,
      },

      {
        path: "payment",
        element: <Payment />,
      },
      {
        path: "becomeSeller",
        element: <BecomeSeller />,
      },

      // Shared
      {
        path: "profile",
        element: <Profile />,
      },

      {
        path: "announcement",
        element: <Announcement />,
      },
    ],
  },
]);
