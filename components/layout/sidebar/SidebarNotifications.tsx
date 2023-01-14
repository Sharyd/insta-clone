import React from 'react';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

const SidebarNotifications = () => {
  return (
    <div className="text-xs">
      <div className="border-b p-4 ">
        <h2 className="font-[500] text-xl mb-8">Notifications</h2>
        <div className="flex items-center justify-between  gap-2">
          <div className="flex gap-2 items-center">
            <img
              src="user-5.jpg"
              alt="user img"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-[500]">Follow requests</h3>
              <p className="text-gray-400">MichaelXXX + 3 others</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <p className="w-[0.43rem] h-[0.43rem] mainColor rounded-full"></p>
            <MdOutlineKeyboardArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="p-4 pt-2">
        <h3 className="font-[500] mb-3">Earlier</h3>
        <div className="flex justify-between items-center gap-2 ">
          <div className="flex items-center gap-2 justify-between w-full">
            <img
              src="user-3.jpeg"
              alt="user"
              className="w-10 h-10 rounded-full"
            />

            <p className="w-full">
              <span className="font-[500]">MichaelXXX</span> started following
              you. <span className="text-gray-400">10w</span>
            </p>
          </div>
          <button className="py-1.5 px-3 border rounded-md font-[500]">
            Following
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarNotifications;
