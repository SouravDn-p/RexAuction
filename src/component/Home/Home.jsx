import { useContext } from "react";
import Slider from "./Slider";
import HotAuction from "./HotAuction";
import BrowsCategory from "./BrowsCategory";
import SdDemo from "./SdDemo";
import ThemeContext from "../../component/Context/ThemeContext";
import UpcomingAuction from "../auction/UpcomingAuction";
import SdUpAuctions from "../auction/SdUpAuctions";
import BlogCard from "../dashboard/shared/Blog/BlogCard";

export default function Home() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div
        className={`transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <Slider darkMode={isDarkMode} />
        <BlogCard darkMode={isDarkMode} />
        <HotAuction darkMode={isDarkMode} />
        {/* <UpcomingAuction darkMode={isDarkMode} /> */}
        <BrowsCategory darkMode={isDarkMode} />
        <SdUpAuctions darkMode={isDarkMode} />
        <SdDemo darkMode={isDarkMode} />
      </div>
    </div>
  );
}
