import { motion } from "framer-motion";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalState, modalTypeState } from "../../atoms/modalAtom";
import { popupState } from "../../atoms/popupAtom";
import { getSelectedImgLengthState } from "../../atoms/postAtom";

interface Props {
  children: JSX.Element[] | JSX.Element | boolean;
}

const Backdrop = ({ children }: Props) => {
  const [popupOpen, setPopupOpen] = useRecoilState(popupState);
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const selectedFiles = useRecoilValue(getSelectedImgLengthState);

  return (
    <motion.div
      className="fixed top-0 left-0 h-full w-full overflow-y-scroll bg-black/70 flex items-center justify-center z-50  overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        e.stopPropagation();
        selectedFiles >= 1 ? setPopupOpen(true) : setModalOpen(false);
      }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
