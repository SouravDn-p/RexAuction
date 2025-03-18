import React from "react";
import Slider from "./Slider";
import FeatureDemo from "./FeatureDemo";

import LiveAuction from "./LiveAuction";
import TrendingAuction from "./TreddingAuction";

import BrowsCategory from "./BrowsCategory";
import HotAuctions from "./HotAuctions";

export default function Home() {
  return (
    <div>
      <Slider></Slider>
    <HotAuctions></HotAuctions>
      <BrowsCategory></BrowsCategory>
      <LiveAuction></LiveAuction>
      <FeatureDemo></FeatureDemo>
      <TrendingAuction></TrendingAuction>
    </div>
  );
}
