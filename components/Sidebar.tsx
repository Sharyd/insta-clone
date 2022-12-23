import React, { useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import {
  AiOutlineHome,
  AiFillHome,
  AiOutlineHeart,
  AiFillHeart,
} from 'react-icons/ai';
import { MdOutlineExplore, MdExplore } from 'react-icons/md';
import { FiPlusSquare } from 'react-icons/fi';
import { IoPaperPlane, IoPaperPlaneOutline } from 'react-icons/io5';
import { AiOutlineInstagram, AiOutlineMenu } from 'react-icons/ai';
import { useAuthState } from 'react-firebase-hooks/auth';
import { IoSettingsOutline } from 'react-icons/io5';
import { VscReport } from 'react-icons/vsc';
import { BiBookmark } from 'react-icons/bi';
import SidebarLink from './SidebarLink';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '../firebase';
import { modalState, modalTypeState } from '../atoms/modalAtom';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import SidebarSearch from './SidebarWindow';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  activeSearch: boolean;
  setActiveSearch: SetterOrUpdater<boolean>;
  activeNotifications: boolean;
  setActiveNotifications: SetterOrUpdater<boolean>;
}
enum typeWindow {
  NOTIFICATIONS = 'Notifications',
  SEARCH = 'search',
}

const Sidebar = ({
  setActiveSearch,
  activeSearch,
  setActiveNotifications,
  activeNotifications,
}: Props) => {
  const [user, loading] = useAuthState(auth);
  const [more, setMore] = useState(false);
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);
  const router = useRouter();

  const active = router.pathname;

  return (
    <div
      className="fixed top-0 left-0 hidden h-full z-20
    p-4 md:flex"
    >
      <AnimatePresence>
        {activeSearch && <SidebarSearch type={typeWindow.SEARCH} />}
      </AnimatePresence>
      <AnimatePresence>
        {activeNotifications && (
          <SidebarSearch type={typeWindow.NOTIFICATIONS} />
        )}
      </AnimatePresence>

      <div
        className={`fixed top-0 left-0 hidden h-full flex-col 
        p-4 md:flex ${
          activeSearch || activeNotifications ? 'xl:w-[85px]' : 'xl:w-[250px]'
        }  w-[85px] xl:items-start bg-white border-r-[2px]`}
      >
        <aside
          className={`mt-5 mb-2.5 space-y-2.5 flex flex-col 
       ${
         activeSearch || activeNotifications ? 'xl:w-14' : 'xl:w-56'
       }  h-full flex-1`}
        >
          <Link href="/home" className="h-20">
            <div className="mt-2 mb-8 h-max group flex items-center justify-center gap-2 py-3 px-3">
              <AiOutlineInstagram
                className={`w-7 h-8 ${
                  activeSearch || activeNotifications
                    ? 'xl:inline'
                    : 'xl:hidden'
                }`}
              />
              <h2
                className={`hidden font-insta text-start text-[1.8rem] ${
                  activeSearch || activeNotifications ? 'xl:hidden' : 'xl:block'
                }`}
              >
                Instagram
              </h2>
            </div>
          </Link>
          <Link href="/home">
            <SidebarLink
              text="Home"
              Icon={active == '/home' ? AiFillHome : AiOutlineHome}
              active={active == '/home'}
              activeSearch={activeSearch}
              activeNotifications={activeNotifications}
            />
          </Link>
          <div
            onClick={() => {
              setActiveSearch(prev => !prev);
              setActiveNotifications(false);
            }}
            className={`${activeSearch && 'border rounded-full'}`}
          >
            <SidebarLink
              text="Search"
              Icon={HiOutlineSearch}
              activeSearch={activeSearch}
              activeNotifications={activeNotifications}
            />
          </div>
          <Link href="/explore">
            <SidebarLink
              text="Explore"
              Icon={active == '/explore' ? MdExplore : MdOutlineExplore}
              active={active == '/explore'}
              activeSearch={activeSearch}
              activeNotifications={activeNotifications}
            />
          </Link>

          <Link href="/messages">
            <SidebarLink
              text="Messages"
              Icon={active == '/messages' ? IoPaperPlane : IoPaperPlaneOutline}
              activeSearch={activeSearch}
              activeNotifications={activeNotifications}
            />
          </Link>

          <div
            onClick={() => {
              setActiveNotifications(prev => !prev);
              setActiveSearch(false);
            }}
          >
            <SidebarLink
              text="Notifications"
              Icon={activeNotifications ? AiFillHeart : AiOutlineHeart}
              activeSearch={activeSearch}
              activeNotifications={activeNotifications}
            />
          </div>
          <div
            onClick={() => {
              setModalOpen(true);
              setModalType('CreatePost');
            }}
          >
            <SidebarLink
              text="Create"
              Icon={FiPlusSquare}
              active={
                modalOpen
                  ? active == '/home' ||
                    active == '/explore' ||
                    router.asPath == `/${user?.uid}`
                  : undefined
              }
              activeSearch={activeSearch}
              activeNotifications={activeNotifications}
            />
          </div>

          <Link
            href={{
              pathname: `/${user?.uid}`,
            }}
          >
            <SidebarLink
              text="Profile"
              img={
                user?.photoURL === null
                  ? 'https://graph.facebook.com/9002313636460828/picture'
                  : user?.photoURL
              }
              active={router.asPath == `/${user?.uid}`}
              activeSearch={activeSearch}
              activeNotifications={activeNotifications}
            />
          </Link>

          <div className="absolute bottom-5 xl:w-56">
            <div onClick={() => setMore(prev => !prev)}>
              <SidebarLink
                text="More"
                Icon={AiOutlineMenu}
                activeSearch={activeSearch}
                activeNotifications={activeNotifications}
              />
            </div>
            <AnimatePresence>
              {more && (
                <motion.div
                  initial={{
                    y: '100%',
                    opacity: 0,
                    width: '5rem',
                    zIndex: '-10',
                  }}
                  animate={{
                    y: '0%',
                    opacity: 1,
                    width: '15rem',
                    zIndex: '0',
                  }}
                  transition={{ duration: 0.2 }}
                  exit={{ y: '100%', opacity: 0, width: '5rem', zIndex: '-10' }}
                  className="bg-white flex flex-col absolute bottom-16 left-0 shadow-lg rounded-md w-60 cursor-pointer  text-[0.9rem]"
                >
                  <div className="flex w-full items-center justify-between border-b-[1px] p-2 hover:bg-gray-100 ">
                    <button className="text-gray-800">Settings</button>
                    <IoSettingsOutline className="w-6 h-6" />
                  </div>
                  <Link href={`/${user?.uid}`}>
                    <div className="flex w-full items-center justify-between border-b-[1px] p-2 hover:bg-gray-100">
                      <button>Saved</button>
                      <BiBookmark className="w-6 h-6" />
                    </div>
                  </Link>
                  <div className="flex w-full items-center justify-between border-b-[1px] p-2 hover:bg-gray-100">
                    <button>Report a problem</button>
                    <VscReport className="w-6 h-6" />
                  </div>
                  <div className="flex w-full items-center justify-between border-b-[1px] p-2 hover:bg-gray-100">
                    <button>Switch accounts</button>
                  </div>
                  <div
                    onClick={() => {
                      auth.signOut();
                      router.push('/');
                    }}
                    className="flex w-full items-center justify-between p-2 hover:bg-gray-100"
                  >
                    <button>Log out</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Sidebar;
