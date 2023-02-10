import { User } from 'firebase/auth';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { NextRouter } from 'next/router';
import React from 'react';
import { BiBookmark } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';
import { VscReport } from 'react-icons/vsc';
import { auth } from '../../../firebase/firebase';

interface Props {
  user: User | null | undefined;
  router: NextRouter;
}

const SidebarMore = ({ user, router }: Props) => {
  return (
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
  );
};

export default SidebarMore;
