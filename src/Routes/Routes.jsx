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
import Profile from "../component/dashboard/shared/profiles/Profile";
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
// import Feedback from "../component/shared/FeedBack";
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
import FeedbackDisplay from "../component/dashboard/admin/feedbacks/FeedbackDisplay";
import PaymentSuccess from "../component/dashboard/buyer/PaymentSuccess";
import PaymentFailed from "../component/dashboard/buyer/PaymentFailed";
import SharedPayment from "../component/dashboard/shared/payment/SharedPayment";
import Blog from "../component/dashboard/shared/Blog/Blog";
import AddBlog from "../component/dashboard/shared/Blog/AddBlog";
import UpdateBlog from "../component/dashboard/shared/Blog/UpdateBlog";
import Blogs from "../component/dashboard/shared/Blog/Blogs";
import BlogDetails from "../component/dashboard/shared/Blog/BlogDetails";
// import Blogs from "../component/Blogs/Blogs";
// import AdminFeedback from "../component/dashboard/admin/AdminFeedback";

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
            `https://rex-auction-server-side-jzyx.onrender.com/payments/${params.trxid}`
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
