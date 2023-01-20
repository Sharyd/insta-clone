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
import SidebarLink from './SidebarLink';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '../../../firebase';
import { modalState, modalTypeState } from '../../../atoms/modalAtom';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import SidebarWindow from './SidebarWindow';
import { AnimatePresence } from 'framer-motion';
import LogoInsta from '../../ui/LogoInsta';
import SidebarMore from './SidebarMore';

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
        {activeSearch && <SidebarWindow type={typeWindow.SEARCH} />}
      </AnimatePresence>
      <AnimatePresence>
        {activeNotifications && (
          <SidebarWindow type={typeWindow.NOTIFICATIONS} />
        )}
      </AnimatePresence>

      <div
        className={`fixed top-0 left-0 hidden h-full flex-col 
        p-4 md:flex ${
          activeSearch || activeNotifications ? 'xl:w-[85px]' : 'xl:w-[255px]'
        }  w-[85px] xl:items-start bg-white border-r-[2px]`}
      >
        <aside
          className={`mt-5 mb-2.5 gap-4 flex flex-col 
       ${
         activeSearch || activeNotifications ? 'xl:w-12' : 'xl:w-56'
       }  h-full flex-1`}
        >
          <Link href="/home" className="h-20">
            <div className="mt-2 mb-8 h-max group flex items-center justify-center py-2 px-2">
              <AiOutlineInstagram
                className={`w-7 h-7 ${
                  activeSearch || activeNotifications
                    ? 'xl:inline'
                    : 'xl:hidden'
                }`}
              />
              <div
                className={`hidden font-insta text-start text-[1.8rem] ${
                  activeSearch || activeNotifications ? 'xl:hidden' : 'xl:block'
                }`}
              >
                <LogoInsta height="29" width="103" />
              </div>
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

          <div
            className={`absolute bottom-5 ${
              activeNotifications || activeSearch ? 'w-12' : 'xl:w-56'
            }`}
          >
            <div onClick={() => setMore(prev => !prev)}>
              <SidebarLink
                text="More"
                Icon={AiOutlineMenu}
                activeSearch={activeSearch}
                activeNotifications={activeNotifications}
              />
            </div>
            <AnimatePresence>
              {more && <SidebarMore user={user} router={router} />}
            </AnimatePresence>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Sidebar;
