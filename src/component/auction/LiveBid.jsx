import React from "react";
import img from "../../assets/LiveBidAuctionDetails.jpg"

export default function LiveBid() {
  return (
    <div className="w-11/12 mx-auto my-8">
      <div className="flex justify-between gap-5">
        <div className="w-2/3 h-screen-1/2 bg-gray-100 rounded-lg">
          <div className="p-3">
            <img src={img} className="rounded-lg" alt="" />
          </div>
          <div className="flex pl-3 pb-3 gap-3">
            <img src={img} className="w-1/6 rounded-lg" alt="" />
            <img src={img} className="w-1/6 rounded-lg" alt="" />
            <img src={img} className="w-1/6 rounded-lg" alt="" />

          </div>
        </div>
        <div className="w-1/3 h-screen-1/2 bg-blue-500 rounded-lg">
          second half
        </div>
      </div>
    </div>
  );
}
