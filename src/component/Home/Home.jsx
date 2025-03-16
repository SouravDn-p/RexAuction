import React from "react";
import Slider from "./Slider";
import FeatureDemo from "./FeatureDemo";
import LiveAuction from "./LiveAuction";
import HotAuction from "./HotAuction";
import BrowsCategory from "./BrowsCategory";
import TrendingAuction from "./TrendingAuction";

export default function Home() {
  return (
    <div>
      <Slider></Slider>
      <HotAuction></HotAuction>
      <BrowsCategory></BrowsCategory>
      <LiveAuction></LiveAuction>
      <FeatureDemo></FeatureDemo>
      <TrendingAuction />
    </div>
  );
}
