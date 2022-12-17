import React from 'react';

import { IoMdHome } from 'react-icons/io';
import { MdOutlineExplore } from 'react-icons/md';
import { FiPlusSquare } from 'react-icons/fi';
import { SlPaperPlane } from 'react-icons/sl';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import { auth } from '../firebase';
import { SetterOrUpdater } from 'recoil';

interface Props {
  type: string;
  setModalOpen: (arg: boolean) => void;
  setModalType: SetterOrUpdater<string>;
}

const BottomNav = ({ type, setModalOpen, setModalType }: Props) => {
  const [user, loading] = useAuthState(auth);
  return (
    <div className="flex w-full items-center justify-around">
      <Link href="/home">
        <IoMdHome className="w-7 h-7 cursor-pointer" />
      </Link>
      <Link href="/explore">
        <MdOutlineExplore className="w-7 h-7 cursor-pointer" />
      </Link>
      <FiPlusSquare
        className="w-7 h-7 cursor-pointer"
        onClick={() => {
          setModalType('createPost');
          setModalOpen(true);
        }}
      />
      <SlPaperPlane className="w-7 h-7 cursor-pointer" />
      <Link href={`/${user?.uid}`}>
        <img
          src={
            user?.photoURL === null
              ? 'https://graph.facebook.com/9002313636460828/picture'
              : user?.photoURL
          }
          alt="user-profile"
          className="w-8 h-8 rounded-full cursor-pointer object-cover"
        />
      </Link>
    </div>
  );
};

export default BottomNav;
