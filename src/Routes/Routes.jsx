import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import AuctionStatus from "../component/dashboard/buyer/AuctionStatus";

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
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      // Admin Only
      {
        path: "createAnnouncement",
        element: <CreateAnnouncement />,
      },
      // Seller Only

      // Buyer only
      {
        path: "auctionStatus",
        element: <AuctionStatus />,
      },
      {
        path: "payment",
        element: <Payment />,
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
