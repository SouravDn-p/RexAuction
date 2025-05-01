import { useContext } from "react";
import Slider from "./Slider";
import HotAuction from "./HotAuction";
import BrowsCategory from "./BrowsCategory";
import SdDemo from "./SdDemo";
import ThemeContext from "../../component/Context/ThemeContext";
import UpcomingAuction from "../auction/UpcomingAuction";
import SdUpAuctions from "../auction/SdUpAuctions";

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
        <HotAuction darkMode={isDarkMode} />
        {/* <UpcomingAuction darkMode={isDarkMode} /> */}
        <SdUpAuctions darkMode={isDarkMode} />
        <BrowsCategory darkMode={isDarkMode} />
        <SdDemo darkMode={isDarkMode} />
      </div>
    </div>
  );
}
