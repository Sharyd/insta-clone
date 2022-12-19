import React from 'react';
import Backdrop from './Backdrop';
import { motion } from 'framer-motion';
import { animation } from '../../lib/animation';
import { useRecoilState } from 'recoil';
import { popupState } from '../../atoms/popupAtom';
import { modalState } from '../../atoms/modalAtom';
import { getSelectedImgLengthState } from '../../atoms/postAtom';

interface Props {
  mainText: string;
  text: string;
  buttonTextYes: string;
  buttonTextNo: string;
}

const Popup = ({ text, mainText, buttonTextYes, buttonTextNo }: Props) => {
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [popupOpen, setPopupOpen] = useRecoilState(popupState);
  const [selectedFiles, setSelectedFiles] = useRecoilState(
    getSelectedImgLengthState
  );

  return (
    <Backdrop>
      <motion.div
        onClick={e => e.stopPropagation()}
        className="rounded-l-lg h-[45rem] flex items-center p-10 justify-center max-w-full"
        variants={animation}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="rounded-xl w-[22rem] h-48 flex items-center z-100 bg-white text-black/60">
          <div className="flex flex-col w-full h-full items-center justify-end">
            <div className="flex items-center justify-end flex-1 flex-col border-b w-full ">
              <h2 className="font-semibold mb-2">{mainText}</h2>
              <p className="text-xs text-gray-400 mb-5 ">{text}</p>
            </div>

            <button
              onClick={() => {
                modalOpen && setModalOpen(false);
                setPopupOpen(false);
                setSelectedFiles(0);
              }}
              className="text-sm font-semibold p-3 border-b w-full text-red-500"
            >
              {buttonTextYes}
            </button>
            <button
              onClick={() => {
                setPopupOpen(false);
              }}
              className="text-sm p-3 w-full"
            >
              {buttonTextNo}
            </button>
          </div>
        </div>
      </motion.div>
    </Backdrop>
  );
};

export default Popup;
