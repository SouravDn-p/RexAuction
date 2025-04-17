import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import AboutUs from "../component/AboutUs/AboutUs";
import LoginPage from "../Auth/LoginPage";
import ErrorPage from "../component/shared/ErrorPage";
import Register from "../Auth/Register";
import ForgotPass from "../Auth/ForgotPasswordModal";
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
import Reports from "../component/dashboard/shared/Reports";
import ManageAuctions from "../component/dashboard/shared/ManageAuctions";
import Feedback from "../component/shared/FeedBack";
import BillingSettings from "../component/Settings/BillingSettings";
import ProfileSettings from "../component/Settings/ProfileSettings";
import PasswordSettings from "../component/Settings/PasswordSettings";
import NotificationSettings from "../component/Settings/NotificationSettings";
import SettingsLayout from "../component/Settings/SettingsLayout";
import Plan from "../component/Settings/Plan";
import TermsAndConditionsBuyer from "../extra/terms/TermsConditionsBuyer";
import EndedAuctionsHistory from "../component/dashboard/shared/EndedAuctionsHistory";
import AccountBalance from "../extra/wallet/AccountBalance";
import Chat from "../component/Chats/Chat";
import WalletHistory from "../extra/wallet/WalletHistory";
import SdBot from "../extra/sdChatBot/SdBot";
import ContactUs from "../component/shared/contactUs";

// import TeamSettings from "../component/Settings/TeamSettings";
// import PlanSettings from "../component/Settings/PlanSettings";
// import EmailSettings from "../component/Settings/EmailSettings";

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
      // Seller Only
      {
        path: "createAuction",
        element: <CreateAuction />,
      },
      // Buyer Only
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
        element: <Feedback />,
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
    ],
  },
]);
