import { useContext, useEffect } from "react";
import MainContent from "../component/dashboard/MainContent";
import SdSidebar from "../component/dashboard/shared/SdSidebar";
import ThemeContext from "../component/Context/ThemeContext";
import { AuthContexts } from "../providers/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";
import LoadingSpinner from "../component/LoadingSpinner";

const DashboardLayout = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user, dbUser, setDbUser, setLoading, loading, setErrorMessage } =
    useContext(AuthContexts);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      axiosPublic
        .get(`/user/${user.email}`)
        .then((res) => {
          setDbUser(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setErrorMessage("Failed to load user data");
          setLoading(false);
        });
    }
  }, [user?.email]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className={`${
        isDarkMode
          ? " bg-gray-900"
          : "bg-gradient-to-b from-purple-100 via-white to-purple-50"
      } min-h-screen max-w-screen`}
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