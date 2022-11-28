import React from "react";

const ChatUsers = () => {
  return (
    <div className="flex py-2 px-6 items-center gap-3">
      <img
        src="user-5.jpg"
        alt="user profile"
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <p className="font-[500]">username</p>
        <p className="text-gray-400 text-xs">last message</p>
      </div>
    </div>
  );
};

export default ChatUsers;
