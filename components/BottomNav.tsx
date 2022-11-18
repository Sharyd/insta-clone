import React from "react";

import { IoMdHome } from "react-icons/io";
import { MdOutlineExplore } from "react-icons/md";
import { FiPlusSquare } from "react-icons/fi";
import { SlPaperPlane } from "react-icons/sl";
const BottomNav = () => {
  return (
    <div className="flex w-full items-center justify-around">
      <IoMdHome className="w-7 h-7" />
      <MdOutlineExplore className="w-7 h-7" />
      <FiPlusSquare className="w-7 h-7" />
      <SlPaperPlane className="w-7 h-7" />
      <img
        src="user-5.jpg"
        alt="user-profile"
        className="w-8 h-8 rounded-full"
      />
    </div>
  );
};

export default BottomNav;
