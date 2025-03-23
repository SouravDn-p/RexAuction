import { useContext } from "react";
import MainContent from "../component/dashboard/MainContent";
import SdSidebar from "../component/dashboard/shared/SdSidebar";
import ThemeContext from "../component/Context/ThemeContext";

const DashboardLayout = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div
      className={` ${
        isDarkMode
          ? " bg-gray-900"
          : "bg-gradient-to-b from-purple-100 via-white to-purple-50"
      } min-h-screen w-screen`}
    >
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <MainContent />
        <SdSidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;
