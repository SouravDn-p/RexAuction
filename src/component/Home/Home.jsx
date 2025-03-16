import React from "react";
import Slider from "./Slider";
import LiveAuction from "./LiveAuction";
import HotAuction from "./HotAuction";
import BrowsCategory from "./BrowsCategory";
import TrendingAuction from "./TrendingAuction";
import SdDemo from "./SdDemo";

export default function Home() {
  return (
    <div>
      <Slider></Slider>
      <HotAuction></HotAuction>
      <BrowsCategory></BrowsCategory>
      <LiveAuction></LiveAuction>
      <SdDemo />
      <TrendingAuction />
    </div>
  );
}
