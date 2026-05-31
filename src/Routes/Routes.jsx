import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import AboutUs from "../components/AboutUs/AboutUs";
import LoginPage from "../Auth/LoginPage";
import ErrorPage from "../components/shared/ErrorPage";
import Register from "../Auth/Register";
import ForgotPass from "../Auth/ForgotPasswordModal";
import Auction from "../components/auction/Auction";
import Home from "../components/Home/Home";
import Announcement from "../components/dashboard/shared/Announcement";
import DashboardLayout from "../layout/DashboardLayout";
import Profile from "../components/dashboard/shared/profiles/Profile";
import LiveBid from "../components/auction/LiveBid";
import CreateAnnouncement from "../components/dashboard/admin/CreateAnnouncement";
import Payment from "../components/dashboard/buyer/Payment";
import BidHistory from "../components/dashboard/buyer/BidHistory";
import BuyerDetails from "../components/dashboard/admin/BuyerDetails";
import BecomeSeller from "../components/dashboard/buyer/BecomeSeller";
import CreateAuction from "../components/dashboard/seller/CreateAuction";
import AuctionStatus from "../components/dashboard/buyer/AuctionStatus";
import UserManagement from "../components/dashboard/admin/UserManagement";
import SellerRequest from "../components/dashboard/admin/SellerRequest";
import AnnouncementDetails from "../components/dashboard/shared/AnnouncementDetails";
import Reports from "../components/dashboard/shared/Reports";
import ManageAuctions from "../components/dashboard/shared/ManageAuctions";
// import Feedback from "../components/shared/FeedBack";
import BillingSettings from "../components/Settings/BillingSettings";
import ProfileSettings from "../components/Settings/ProfileSettings";
import PasswordSettings from "../components/Settings/PasswordSettings";
import NotificationSettings from "../components/Settings/NotificationSettings";
import SettingsLayout from "../components/Settings/SettingsLayout";
import Plan from "../components/Settings/Plan";
import TermsAndConditionsBuyer from "../extra/terms/TermsConditionsBuyer";
import EndedAuctionsHistory from "../components/dashboard/shared/EndedAuctionsHistory";
import AccountBalance from "../extra/wallet/AccountBalance";
import Chat from "../components/Chats/Chat";
import WalletHistory from "../extra/wallet/WalletHistory";
import SdBot from "../extra/sdChatBot/SdBot";

import FeedbackDisplay from "../components/dashboard/admin/feedbacks/FeedbackDisplay";
import PaymentSuccess from "../components/dashboard/buyer/PaymentSuccess";
import PaymentFailed from "../components/dashboard/buyer/PaymentFailed";
import SharedPayment from "../components/dashboard/shared/payment/SharedPayment";
import Blog from "../components/dashboard/shared/Blog/Blog";
import AddBlog from "../components/dashboard/shared/Blog/AddBlog";
import UpdateBlog from "../components/dashboard/shared/Blog/UpdateBlog";
import Blogs from "../components/dashboard/shared/Blog/Blogs";
import BlogDetails from "../components/dashboard/shared/Blog/BlogDetails";
import ContactUs from "../components/shared/ContactUs";
// import Blogs from "../components/Blogs/Blogs";
// import AdminFeedback from "../components/dashboard/admin/AdminFeedback";

// import TeamSettings from "../components/Settings/TeamSettings";
// import PlanSettings from "../components/Settings/PlanSettings";
// import EmailSettings from "../components/Settings/EmailSettings";

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
        path: "blogs",
        element: <Blogs />,
      },
      {
        path: "blogDetails/:id",
        element: <BlogDetails />,
      },
      {
        path: "/auction",
        element: <Auction />,
      },
      {
        path: "/contactUs",
        element: <ContactUs />,
      },
      {
        path: "/liveBid/:id",
        element: <LiveBid />,
      },
      {
        path: "/sdLiveBid/:id",
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
        path: "/ForgotPasswordModal",
        element: <ForgotPass />,
      },
      {
        path: "announcementDetails/:id",
        element: <AnnouncementDetails />,
      },
      {
        path: "terms",
        element: <TermsAndConditionsBuyer />,
      },
      {
        path: "addBalance",
        element: <AccountBalance />,
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
        path: "endedAuctions",
        element: <EndedAuctionsHistory />,
      },
      {
        path: "sellerRequest",
        element: <SellerRequest />,
      },
      // {
      //   path: "adminFeedback",
      //   element: <AdminFeedback />,
      // },
      // Seller Only
      {
        path: "createAuction",
        element: <CreateAuction />,
      },
      // Buyer Only
      {
        path: "payments/:trxid",
        element: <PaymentSuccess />,
        loader: ({ params }) =>
          fetch(
            `${import.meta.env.VITE_API_URL}/payments/${params.trxid}`
          ),
      },
      {
        path: "paymentFailed",
        element: <PaymentFailed />,
      },
      {
        path: "termsConditionsBuyer",
        element: <TermsAndConditionsBuyer />,
      },
      {
        path: "bidHistory",
        element: <BidHistory />,
      },
      {
        path: "status",
        element: <AuctionStatus />,
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
        path: "settings",
        element: <SettingsLayout />,
        children: [
          {
            path: "profile",
            element: <ProfileSettings />,
          },
          {
            path: "password",
            element: <PasswordSettings />,
          },
          {
            path: "billings",
            element: <BillingSettings />,
          },
          {
            path: "notifications",
            element: <NotificationSettings />,
          },
          {
            index: true,
            element: <ProfileSettings />,
          },
          {
            path: "plan",
            element: <Plan />,
          },
        ],
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "announcement",
        element: <Announcement />,
      },
      {
        path: "rexBot",
        element: <SdBot />,
      },
      {
        path: "feedback",
        element: <FeedbackDisplay />,
      },
      {
        path: "addBalance",
        element: <AccountBalance />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "walletHistory",
        element: <WalletHistory />,
      },
      {
        path: "payment",
        element: <Payment />,
      },
      {
        path: "sharedPayment",
        element: <SharedPayment />,
      },

      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "create-blog",
        element: <AddBlog></AddBlog>,
      },
      {
        path: "updateBlog/:id",
        element: <UpdateBlog></UpdateBlog>,
      },
    ],
  },
]);
