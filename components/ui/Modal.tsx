import { motion } from 'framer-motion';
import Backdrop from './Backdrop';

import CreatePost from '../post/CreatePost';
import { animation } from '../../helpers/animation';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  getPostState,
  getSelectedImgLengthState,
  getPostIdState,
} from '../../atoms/postAtom';
import Post from '../post/Post';
import { AiOutlineClose } from 'react-icons/ai';
import { popupState } from '../../atoms/popupAtom';

interface Props {
  type: string;
  setModalOpen: (arg0: boolean) => void;
}

const Modal = ({ type, setModalOpen }: Props) => {
  const post = useRecoilValue(getPostState);
  const id = useRecoilValue(getPostIdState);
  const selectedFiles = useRecoilValue(getSelectedImgLengthState);
  const [popupOpen, setPopupOpen] = useRecoilState(popupState);
  return (
    <Backdrop>
      <div
        className="absolute top-4 right-4 cursor-pointer"
        onClick={() =>
          selectedFiles >= 1 ? setPopupOpen(true) : setModalOpen(false)
        }
      >
        <AiOutlineClose className="w-7 h-6 text-white opacity-85" />
      </div>
      {type === 'modalPost' ? (
        <>
          <div
            onClick={e => e.stopPropagation()}
            className="h-[80vh] w-[800px] md:h-[90vh] p-1 scrollbar-hide"
          >
            <Post post={post} id={id} modalPost />
          </div>
        </>
      ) : (
        <motion.div
          onClick={e => e.stopPropagation()}
          className="rounded-l-lg h-[45rem] flex items-center p-10 justify-center max-w-full"
          variants={animation}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="h-[75vh] w-full flex justify-center">
            <CreatePost />
          </div>
        </motion.div>
      )}
    </Backdrop>
  );
};

export default Modal;
