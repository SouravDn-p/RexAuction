import React from "react";
import Slider from "./Slider";

import HotAuctions from "./HotAuctions";
import BrowsCategorys from "./BrowsCategorys";
import LiveAuctions from "./LiveAuctions";
import FeatureDemos from "./FeatureDemos";
import TrendingAuctions from "./TrendingAuctions";

export default function Home() {
  return (
    <div>
      <Slider></Slider>
      <HotAuctions></HotAuctions>
      <BrowsCategorys></BrowsCategorys>
      <LiveAuctions></LiveAuctions>
     <FeatureDemos></FeatureDemos>
    <TrendingAuctions></TrendingAuctions>
    </div>
  );
}
