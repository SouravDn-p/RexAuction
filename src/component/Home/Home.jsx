import React from "react";
import Slider from "./Slider";
import FeatureDemo from "./FeatureDemo";
import Card from "./Card";
import SellingSection from "./SellingSection";
import SdCard from "./SdCard";

export default function Home() {
  return (
    <div>
      <Slider></Slider>
      <FeatureDemo></FeatureDemo>
      <Card></Card>
      <SellingSection></SellingSection>
    </div>
  );
}
