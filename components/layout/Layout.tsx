import React, { useState } from 'react';
import Nav from './Nav';
import BottomNav from './BottomNav';
import Sidebar from './sidebar/Sidebar';
import Footer from './Footer';
import { useRecoilState } from 'recoil';
import { modalState, modalTypeState } from '../../atoms/modalAtom';
import { AnimatePresence } from 'framer-motion';
import Modal from '../ui/Modal';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import LoadingSpinner from '../ui/LoadingSpinner';
import { auth } from '../../firebase';

interface Props {
  children: JSX.Element[] | JSX.Element;
  hideFooter?: boolean;
}

const Layout = ({ children, hideFooter }: Props) => {
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);
  const [user, loading] = useAuthState(auth);
  const [activeSearch, setActiveSearch] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState(false);

  const router = useRouter();

  if (loading) return <LoadingSpinner />;
  if (!user) router.push('/');

  return (
    <div>
      <header className="md:hidden">
        <Nav setActiveSearch={setActiveSearch} activeSearch={activeSearch} />
      </header>

      <div>
        <div className="xl:w-[calc(100%-255px)] md:w-[calc(100%-85px)] md:ml-auto">
          <Sidebar
            setActiveSearch={setActiveSearch}
            activeSearch={activeSearch}
            activeNotifications={activeNotifications}
            setActiveNotifications={setActiveNotifications}
          />

          <main
            onClick={() => {
              setActiveSearch(false);
              setActiveNotifications(false);
            }}
            className="bg-gray-100 relative flex flex-col min-h-screen items-center md:flex-row"
          >
            {children}
          </main>
          {!hideFooter && (
            <div className="pb-20 md:p-6 mt-16">
              <Footer />
            </div>
          )}
        </div>
        <div className="mt-auto w-full fixed bottom-0 left-0 p-4 border-t-[1px] md:hidden bg-white z-20">
          <BottomNav setModalOpen={setModalOpen} setModalType={setModalType} />
        </div>
        <AnimatePresence>
          {modalOpen && <Modal type={modalType} setModalOpen={setModalOpen} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Layout;
