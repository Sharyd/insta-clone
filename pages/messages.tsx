import React from "react";
import Layout from "../components/Layout";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import ChatUsers from "../components/chat/ChatUsers";
import { HiOutlineSearch } from "react-icons/hi";
import { BsTelephone, BsCameraVideo } from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Message from "../components/chat/Message";

const Messages = () => {
  const [user, loading] = useAuthState(auth);
  return (
    <Layout>
      <section className="m-auto lg:flex mt-16 md:mt-8 text-[0.85rem] h-[800px] ">
        <div className="flex relative bg-white flex-col h-full border">
          <div className="flex border-b flex-col py-3 px-8 w-[300px]">
            <p className="font-[500] p-2 px-4">{user?.displayName}</p>
            <div className="relative flex items-center mb-2 group">
              <div className="group-focus:hidden absolute bg-gray-100 w-10 h-10 flex items-center justify-center rounded-l-lg">
                <HiOutlineSearch className=" text-gray-400 bg-gray-100" />
              </div>
              <input
                className="focus:outline-none group-ml-0 bg-gray-100 ml-6  w-full p-4 h-10 rounded-lg placeholder:text-sm placeholder:font-thin"
                type="text"
                placeholder="Search users"
              />
            </div>
          </div>
          <div className="overflow-y-scroll">
            <ChatUsers />
            <ChatUsers />
            <ChatUsers />
            <ChatUsers />
            <ChatUsers />
            <ChatUsers />
            <ChatUsers />
            <ChatUsers />
            <ChatUsers />
            <ChatUsers />
            <ChatUsers />
            <ChatUsers />
            <ChatUsers />
          </div>
        </div>
        <div>
          <div className="w-[480px] bg-white h-full border border-l-0 overflow-y-scroll">
            <div className="p-[34px] px-4 border-b flex items-center justify-between  ">
              <div className="flex items-center gap-2">
                <img
                  src="user-5.jpg"
                  alt="user-profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-[500]">username</p>
                  <span className="text-xs text-gray-400">Active 2h ago</span>
                </div>
              </div>
              <div className="flex gap-3">
                <BsTelephone className="w-6 h-6 text-gray-900 cursor-pointer" />
                <BsCameraVideo className="w-6 h-6 text-gray-900 cursor-pointer" />
                <AiOutlineInfoCircle className="w-6 h-6 text-gray-900 cursor-pointer" />
              </div>
            </div>

            <div className="h-full">
              <Message />
              <Message />
              <Message />

              <div></div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Messages;
