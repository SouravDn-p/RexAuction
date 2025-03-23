import MainContent from "../component/dashboard/MainContent";
import SdSidebar from "../component/dashboard/shared/SdSidebar";

const DashboardLayout = () => {
  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        {/* Main Content */}
        <MainContent />
        {/* Sidebar */}
        <SdSidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;
