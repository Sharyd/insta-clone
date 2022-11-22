import React, { useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { HiOutlineSearch } from "react-icons/hi";
import { IoMdHome } from "react-icons/io";
import { MdOutlineExplore } from "react-icons/md";
import { FiPlusSquare } from "react-icons/fi";
import { SlPaperPlane } from "react-icons/sl";
import { AiOutlineInstagram } from "react-icons/ai";
import { AiOutlineMenu } from "react-icons/ai";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoSettingsOutline } from "react-icons/io5";
import { VscReport } from "react-icons/vsc";
import { BiBookmark } from "react-icons/bi";
import SidebarLink from "./SidebarLink";
import Link from "next/link";
import { useRouter } from "next/router";
import { auth } from "../firebase";
import { modalState, modalTypeState } from "../atoms/modalAtom";
import CreatePost from "./CreatePost";
import { useRecoilState } from "recoil";
const Sidebar = () => {
  const [user, loading] = useAuthState(auth);
  const [more, setMore] = useState(false);
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);
  const router = useRouter();

  return (
    <div
      className="fixed top-0 left-0 hidden h-full flex-col
  p-4 md:flex xl:w-[250px] xl:items-start bg-white border-r-[2px] z-10"
    >
      <div className="mt-4 mb-2.5 space-y-2.5 flex flex-col xl:w-56 h-full flex-1">
        <Link href="/home">
          <div className="mt-2 mb-6 group flex items-center justify-center py-3 px-3">
            <AiOutlineInstagram className="w-7 h-8 xl:hidden " />
            <h2 className="hidden font-insta text-[1.9rem] xl:block">
              Instagram
            </h2>
          </div>
        </Link>
        <Link href="/home">
          <SidebarLink
            text="Home"
            Icon={IoMdHome}
            active={router.pathname == "/home"}
          />
        </Link>
        <SidebarLink text="Search" Icon={HiOutlineSearch} />
        <SidebarLink text="Explore" Icon={MdOutlineExplore} />

        <SidebarLink text="Messages" Icon={SlPaperPlane} />

        <SidebarLink text="Notifications" Icon={AiOutlineHeart} />
        <div
          onClick={() => {
            setModalOpen(true);
            setModalType("CreatePost");
          }}
        >
          <SidebarLink
            text="Create"
            Icon={FiPlusSquare}
            active={
              modalOpen
                ? router.pathname == "/home" || router.pathname == "/profile"
                : undefined
            }
          />
        </div>
        <Link href={`/profile/${user?.uid}`}>
          <SidebarLink
            text="Profile"
            img={
              user?.photoURL === null
                ? "https://graph.facebook.com/9002313636460828/picture"
                : user?.photoURL
            }
            active={router.pathname == "/profile"}
          />
        </Link>
        <div className="absolute bottom-5 xl:w-56 ">
          <div onClick={() => setMore((prev) => !prev)}>
            <SidebarLink text="More" Icon={AiOutlineMenu} />
          </div>
          {more && (
            <div className="bg-white flex flex-col absolute bottom-16 left-0 shadow-lg rounded-md w-60 cursor-pointer">
              <div className="flex w-full items-center justify-between border-b-[1px] p-2 hover:bg-gray-100 ">
                <p className="text-gray-800">Settings</p>
                <IoSettingsOutline className="w-7 h-7" />
              </div>
              <div className="flex w-full items-center justify-between border-b-[1px] p-2 hover:bg-gray-100">
                <p>Saved</p>
                <BiBookmark className="w-7 h-7" />
              </div>
              <div className="flex w-full items-center justify-between border-b-[1px] p-2 hover:bg-gray-100">
                <p>Report a problem</p>
                <VscReport className="w-7 h-7" />
              </div>
              <div className="flex w-full items-center justify-between border-b-[1px] p-2 hover:bg-gray-100">
                <button>Switch accounts</button>
              </div>
              <div
                onClick={() => {
                  auth.signOut();
                  router.push("/");
                }}
                className="flex w-full items-center justify-between p-2 hover:bg-gray-100"
              >
                <button>Log out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
