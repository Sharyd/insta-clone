import React from 'react';
import { AiOutlineHome, AiFillHome } from 'react-icons/ai';

import { MdOutlineExplore, MdExplore } from 'react-icons/md';
import { FiPlusSquare } from 'react-icons/fi';
import { IoPaperPlane, IoPaperPlaneOutline } from 'react-icons/io5';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import { auth } from '../../firebase/firebase';
import { SetterOrUpdater } from 'recoil';
import { useRouter } from 'next/router';

interface Props {
  setModalOpen: (arg: boolean) => void;
  setModalType: SetterOrUpdater<string>;
}

const BottomNav = ({ setModalOpen, setModalType }: Props) => {
  const [user, _] = useAuthState(auth);
  const router = useRouter();
  const active = router.pathname;
  return (
    <div className="flex w-full items-center justify-around">
      <Link href="/home">
        {active === '/home' ? (
          <AiFillHome className="w-7 h-7 cursor-pointer" />
        ) : (
          <AiOutlineHome className="w-7 h-7 cursor-pointer" />
        )}
      </Link>
      <Link href="/explore">
        {active === '/explore' ? (
          <MdExplore className="w-7 h-7 cursor-pointer" />
        ) : (
          <MdOutlineExplore className="w-7 h-7 cursor-pointer" />
        )}
      </Link>
      <FiPlusSquare
        className="w-7 h-7 cursor-pointer"
        onClick={() => {
          setModalType('createPost');
          setModalOpen(true);
        }}
      />
      <Link href="/messages">
        {active === '/messages' ? (
          <IoPaperPlane className="w-7 h-7 cursor-pointer" />
        ) : (
          <IoPaperPlaneOutline className="w-7 h-7 cursor-pointer" />
        )}
      </Link>
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
