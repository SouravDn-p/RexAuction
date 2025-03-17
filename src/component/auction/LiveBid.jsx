import React from "react";
import img from "../../assets/LiveBidAuctionDetails.jpg"
import { GiSelfLove } from "react-icons/gi";
import { FaShare } from "react-icons/fa6";
import { IoFlagOutline } from "react-icons/io5";

export default function LiveBid() {
  return (
    <div className="w-11/12 mx-auto my-8">
      <div className="flex justify-between gap-5">
        <div className="w-2/3 h-screen-1/2 bg-gray-100 rounded-lg p-3">
          <div className="">
            <img src={img} className="rounded-lg" alt="" />
          </div>
          <div className="flex pt-3 gap-3">
            <img src={img} className="w-1/6 rounded-lg" alt="" />
            <img src={img} className="w-1/6 rounded-lg" alt="" />
            <img src={img} className="w-1/6 rounded-lg" alt="" />
          </div>
          <div className="py-10 ">
            <div className="flex text-3xl text-black font-bold justify-between items-center">
              <h3>1823s Gramophone</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <GiSelfLove />
                <FaShare />
                <IoFlagOutline />
              </div>
            </div>
            <h3 className="text-black text-xl font-semibold pt-3">Description:</h3>
            <p className="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque fugit earum eligendi deleniti accusantium quos ipsum iure, quisquam tenetur nostrum delectus amet expedita labore unde nam, dolorem quas corporis distinctio soluta? Ratione voluptate quis, cum alias iste expedita recusandae. Quasi modi sequi eveniet velit, quibusdam beatae. Alias unde explicabo quis!</p>

          </div>
        </div>

        <div className="w-1/3 h-screen-1/2 bg-blue-500 rounded-lg">
          second half
        </div>
      </div>
    </div>
  );
}
