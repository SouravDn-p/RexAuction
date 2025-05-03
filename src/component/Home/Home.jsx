import { useContext } from "react";
import Slider from "./Slider";
import LiveAuction from "./LiveAuction";
import HotAuction from "./HotAuction";
import BrowsCategory from "./BrowsCategory";
import TrendingAuction from "./TrendingAuction";
import SdDemo from "./SdDemo";
import ThemeContext from "../../component/Context/ThemeContext";
import UpcomingAuction from "../auction/UpcomingAuction";
import BlogCard from "../dashboard/shared/Blog/BlogCard";

export default function Home() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div
        className={`transition-colors duration-300 ${
          isDarkMode
            ? "bg-gradient-to-r from-[#182939] to-[#000000] text-white"
            : "bg-white text-gray-900"
        }`}
      >
        <Slider darkMode={isDarkMode} />
        <BlogCard darkMode={isDarkMode} />
        <HotAuction darkMode={isDarkMode} />
        <UpcomingAuction darkMode={isDarkMode} />
        <BrowsCategory darkMode={isDarkMode} />
       
        {/* <LiveAuction darkMode={isDarkMode} /> */}
        <SdDemo darkMode={isDarkMode} />
        {/* <TrendingAuction darkMode={isDarkMode} /> */}
      </div>
    </div>
  );
}
