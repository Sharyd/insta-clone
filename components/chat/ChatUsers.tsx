import { DocumentData } from "firebase/firestore";
import React from "react";

interface Props {
  user: DocumentData;
}

const ChatUsers = ({ user }: Props) => {
  return (
    <div className="flex py-2 px-6 items-center gap-3 w-full hover:bg-gray-100 cursor-pointer">
      <img
        src={user?.photoURL}
        alt="user profile"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <p className="font-[500]">{user?.displayName}</p>
        <p className="text-gray-400 text-xs">last message</p>
      </div>
    </div>
  );
};

export default ChatUsers;
