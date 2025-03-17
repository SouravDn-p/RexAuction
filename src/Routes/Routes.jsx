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
        path: "/announcement",
        element: <Announcement />,
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
      {
        index: true,
        element: <Profile />,
      },
    ],
  },
]);
