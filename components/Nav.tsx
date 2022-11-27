import Link from "next/link";
import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { HiOutlineSearch } from "react-icons/hi";
const Nav = () => {
  return (
    <div className="fixed bg-white w-full flex justify-between items-center p-0.5 border-b-[1px] h-16 z-20">
      <Link href="/home">
        <h2 className="font-insta text-[2rem] p-2 cursor-pointer">Instagram</h2>
      </Link>
      <div className="group flex gap-2 items-center bg-gray-100 p-2 pl-3 rounded-md">
        <HiOutlineSearch className="group-focus:hidden text-gray-400 w-5 h-5" />
        <input
          className="relative bg-gray-100 text-sm outline-none group-focus:w-full placeholder:font-thin "
          type="text"
          placeholder="Search"
        />
      </div>
      <div>
        <AiOutlineHeart className="h-7 w-7 mr-2 cursor-pointer hover:scale-105 transition-all" />
      </div>
    </div>
  );
};

export default Nav;
