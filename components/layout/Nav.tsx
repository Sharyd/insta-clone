import Link from 'next/link';
import React, { useState } from 'react';

import { AiOutlineHeart } from 'react-icons/ai';
import { HiOutlineSearch } from 'react-icons/hi';

import SearchedUsers from '../SearchedUsers';

import { DocumentData } from 'firebase/firestore';
import useSearchUsers from '../../hooks/use-searchUsers';
import { SetterOrUpdater } from 'recoil';
import { AnimatePresence, motion } from 'framer-motion';
import LogoInsta from '../ui/LogoInsta';

interface Props {
  activeSearch: boolean;
  setActiveSearch: SetterOrUpdater<boolean>;
}

const Nav = ({ activeSearch, setActiveSearch }: Props) => {
  const { username, setUsername, filteredUsers } = useSearchUsers();

  return (
    <div className="fixed bg-white w-full flex justify-between items-center p-0.5 border-b-[1px] h-16 z-20">
      <Link href="/home" className="pl-2">
        <LogoInsta height="29" width="103" />
      </Link>
      <div className="relative">
        <div className="group flex gap-2 items-center bg-gray-100 p-2 pl-3 rounded-md">
          <HiOutlineSearch className="group-focus:hidden text-gray-400 w-5 h-5" />
          <input
            className="max-w-[10rem] relative bg-gray-100 text-sm outline-none group-focus:w-full placeholder:font-thin "
            type="text"
            placeholder="Search"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onClick={() => setActiveSearch(prev => !prev)}
          />
        </div>

        {activeSearch && (
          <motion.div
            initial={{
              opacity: 0,
              y: '-20px',
            }}
            animate={{
              opacity: 1,
              y: '10px',
            }}
            transition={{ duration: 0.2 }}
            className="absolute bg-white min-w-[200px] rounded-b-md max-h-[250px] overflow-y-scroll scrollbar-hide"
          >
            {filteredUsers.map((users: DocumentData) => (
              <SearchedUsers users={users} key={users.uid} />
            ))}
          </motion.div>
        )}
      </div>
      <div>
        <AiOutlineHeart className="h-7 w-7 mr-2 cursor-pointer hover:scale-105 transition-all" />
      </div>
    </div>
  );
};

export default Nav;
