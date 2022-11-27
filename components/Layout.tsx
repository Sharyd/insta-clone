import React, { useState } from "react";
import Nav from "../components/Nav";
import BottomNav from "../components/BottomNav";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useRecoilState } from "recoil";
import { modalState, modalTypeState } from "../atoms/modalAtom";
import { AnimatePresence } from "framer-motion";
import Modal from "./ui/Modal";
import SidebarSearch from "./SidebarWindow";
interface Props {
  children: JSX.Element[] | JSX.Element;
}

const Layout = ({ children }: Props) => {
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);

  const [activeSearch, setActiveSearch] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState(false);
  return (
    <>
      <header className="md:hidden">
        <Nav />
      </header>

      <div>
        <div className="xl:w-[calc(100%-250px)] md:w-[calc(100%-85px)] md:ml-auto">
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
          <div className="pb-20 md:p-6 mt-16">
            <Footer />
          </div>
        </div>
        <div className="mt-auto w-full fixed bottom-0 left-0 p-4 border-t-[1px] md:hidden bg-white z-20">
          <BottomNav
            type={modalType}
            setModalOpen={setModalOpen}
            setModalType={setModalType}
          />
        </div>
        <AnimatePresence>
          {modalOpen && <Modal type={modalType} setModalOpen={setModalOpen} />}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Layout;
