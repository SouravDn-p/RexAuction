import Sidebar from "./Sidebar";
import MainContent from "./MainContent";

const Dashboard = () => {
  const isAdmin = false;  
  const isSeller = false;

  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

        {/* Main Content */}
        <MainContent isAdmin={isAdmin} isSeller={isSeller} />

        {/* Sidebar */}
        <Sidebar isAdmin={isAdmin} isSeller={isSeller} />
      </div>
    </div>
  );
};

export default Dashboard;
