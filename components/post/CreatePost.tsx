import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { BiArrowBack } from 'react-icons/bi';
import { useAuthState } from 'react-firebase-hooks/auth';
import { IoLocationOutline } from 'react-icons/io5';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { AiOutlinePlusCircle, AiOutlineSmile } from 'react-icons/ai';
import { AiOutlineClose } from 'react-icons/ai';
import BtnSlider from '../stories/SliderBtn';
import { auth } from '../../firebase';

import useSlider from '../../hooks/use-slider';
import {
  addDoc,
  collection,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { storage, db } from '../../firebase';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Popup from '../ui/Popup';

import { popupState } from '../../atoms/popupAtom';
import { getSelectedImgLengthState } from '../../atoms/postAtom';
import { useRecoilState } from 'recoil';
import { RotatingLines } from 'react-loader-spinner';
import useEmoji from '../../hooks/use-emoji';
import EmojiPicker from 'emoji-picker-react';
import { EmojiStyle } from 'emoji-picker-react';
import CreatePostIcon from './CreatePostIcon';

import { isImageValid } from '../../helpers/isImageValid';

const CreatePost = () => {
  const [selectedFilesURL, setSelectedFilesURL] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useRecoilState(popupState);
  const [selectedImgLength, setSelectedImgLength] = useRecoilState(
    getSelectedImgLengthState
  );

  const [next, setNext] = useState(false);
  const [error, setError] = useState('');
  const refFileToElement = useRef<HTMLInputElement>(null);
  const [user] = useAuthState(auth);

  const {
    text,
    setText,
    showEmojis,
    setShowEmojis,
    resetEmojiAndText,
    addEmoji,
  } = useEmoji();
  const { setSlideIndex, slideIndex, prevSlide, nextSlide } = useSlider(
    selectedFilesURL?.length - 1
  );

  const moveDot = (index: number) => {
    setSlideIndex(index);
  };

  const addSelectedImage = (e: { target: { files: any } }) => {
    const files = e.target.files[0] as Blob;
    const type = files?.type as string;

    if (isImageValid(type)) {
      setSelectedFilesURL((prev: string[]) => [
        ...prev,
        {
          id: uuidv4(),
          imagesToPreview: URL.createObjectURL(e.target.files[0]),
          imagesToDB: e.target.files[0],
        },
      ]);
      setError('');
    } else {
      setError('Wrong image format!');
    }
  };

  useEffect(() => {
    setSelectedImgLength(selectedFilesURL?.length);
  }, [selectedFilesURL]);

  const removeItemFromSlider = (id: string) => {
    const filteredItems = selectedFilesURL?.filter(
      (data: { id: string }) => id !== data.id
    );
    setSelectedFilesURL(filteredItems);
    prevSlide();
    setNext(false);
  };

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, 'posts'), {
      userid: user?.uid,
      username: user?.displayName,
      userImg:
        user?.photoURL === null
          ? 'https://graph.facebook.com/9002313636460828/picture'
          : user?.photoURL,
      text: text,
      timestamp: serverTimestamp(),
      email: user?.email,
    });

    if (selectedFilesURL.length !== 0) {
      const promises: unknown[] = [];

      selectedFilesURL?.map((file: { imagesToDB: File }) => {
        const storageRef = ref(
          storage,
          `posts/${docRef?.id}/${file.imagesToDB.name}`
        );
        return promises.push(
          uploadBytes(storageRef, file.imagesToDB).then(uploadResult => {
            return getDownloadURL(uploadResult.ref);
          })
        );
      });

      // Get all the downloadURLs
      const photos = await Promise.all(promises);

      // // Update Firestore with the URLs array
      try {
        await setDoc(
          docRef,
          {
            image: photos.map(url => url),
          },
          { merge: true }
        ).then(r => {
          console.log('done!');
        });
      } catch (err) {
        setError(
          (err as { message?: string })?.message ?? 'Something went wrong'
        );
      }
    }

    setLoading(false);
    resetEmojiAndText();
    setNext(false);
    setSelectedFilesURL([]);
  };

  return (
    <>
      <div
        className={`${
          next ? 'xl:w-[1000px] lg:w-[925px] md:w-[760px] w-[350px] ' : ''
        } h-[30rem] md:h-[40rem] ${
          selectedFilesURL.length === 0 && 'w-[42.5rem]'
        }  w-full bg-white rounded-xl text-gray-800 `}
      >
        {selectedFilesURL.length === 0 && (
          <>
            <h2 className="text-center p-2 w-full border-b font-semibold">
              Create a new post
            </h2>
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <CreatePostIcon />
              <h2 className="text-xl sm:text-2xl font-thin">Select photos</h2>
              <div
                onClick={() => refFileToElement?.current?.click()}
                className="text-sm mainColor text-white py-1.5 px-2.5 font-semibold rounded-[4px] cursor-pointer"
              >
                <p>Select from computer</p>
                <input
                  type="file"
                  hidden
                  ref={refFileToElement}
                  multiple
                  onChange={addSelectedImage}
                />
              </div>
              {error && <p className="text-red-500 capitalize">{error}</p>}
            </div>
          </>
        )}
        {selectedFilesURL.length !== 0 && (
          <>
            <div className="rounded-md bg-white h-10 flex items-center justify-between">
              <div
                onClick={() => (!next ? setPopupOpen(true) : setNext(false))}
                className="cursor-pointer"
              >
                <BiArrowBack className="w-7 h-7 ml-3" />
              </div>

              {!next ? (
                <button
                  className="textMainColor mr-3 text-sm"
                  onClick={() => setNext(true)}
                >
                  Next
                </button>
              ) : (
                <button
                  className="textMainColor mr-3 text-sm"
                  onClick={sendPost}
                >
                  Share
                </button>
              )}
            </div>
            {!loading ? (
              <div className="flex border-t flex-col md:flex-row overflow-hidden">
                <div className="relative">
                  <div className="bg-black relative h-[20.5rem] w-[21.9rem] md:h-[38rem] md:w-[27.5rem] lg:h-[40.5rem] lg:w-[37rem] xl:w-[41rem]  overflow-hidden">
                    {selectedFilesURL?.map(
                      (
                        data: { id: string; imagesToPreview: string },
                        index: number
                      ) => (
                        <>
                          <div className="relative">
                            {slideIndex === index && (
                              <div
                                key={data.id}
                                className="absolute h-[20.5rem] w-[21.9rem] md:h-[38rem] md:w-[27.5rem] lg:h-[40.5rem] lg:w-full object-cover "
                                style={{
                                  backgroundImage: `url(${data.imagesToPreview})`,
                                  backgroundRepeat: 'no-repeat',
                                  backgroundSize: 'contain',
                                  backgroundPosition: 'center center',
                                }}
                              >
                                <div className="absolute right-2 md:-right-2 lg:-right-10 mx-8 my-2 lg:mr-16 lg:m-4 flex items-center justify-center bg-black/60 h-7 w-7 rounded-full cursor-pointer hover:opacity-80 transition-all">
                                  <AiOutlineClose
                                    onClick={() => {
                                      removeItemFromSlider(data.id);
                                    }}
                                    className="text-white h-4 w-4"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )
                    )}

                    {slideIndex !== selectedFilesURL?.length - 1 && (
                      <BtnSlider moveSlide={nextSlide} direction={'next'} />
                    )}
                    {slideIndex !== 0 && (
                      <BtnSlider moveSlide={prevSlide} direction={'prev'} />
                    )}
                    <div className="flex gap-2">
                      {selectedFilesURL.length > 1 &&
                        selectedFilesURL.map((_: string, index: number) => (
                          <div
                            key={index}
                            onClick={() => moveDot(index)}
                            className={`w-2 h-2 flex relative rounded-full -bottom-[38rem] left-1/2 bg-gray-100 cursor-pointer z-50 ${
                              slideIndex === index && 'bg-blue-500'
                            }`}
                          ></div>
                        ))}
                    </div>
                  </div>

                  {!next && (
                    <div
                      onClick={() => refFileToElement?.current?.click()}
                      className="flex items-center justify-center absolute bottom-4 right-4 bg-black/60 h-10 w-10 rounded-full cursor-pointer hover:opacity-80 transition-all"
                    >
                      <AiOutlinePlusCircle className="w-7 h-7 text-white" />
                      <input
                        type="file"
                        hidden
                        multiple
                        ref={refFileToElement}
                        onChange={addSelectedImage}
                      />
                    </div>
                  )}
                </div>

                {next && !loading && (
                  <motion.div
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    className="relative w-full md:w-[24.5rem] lg:w-[25rem]  rounded-md rounded-bl-none overflow-hidden bg-white text-gray-800 text-[0.925rem] md:text-md"
                    transition={{ bounce: 0, duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2 ml-4 mt-4">
                      <img
                        src={user?.photoURL ?? ''}
                        alt="profile-img"
                        className="w-7 h-7 rounded-full overflow-hidden "
                      />
                      <p>{user?.displayName}</p>
                    </div>
                    <div className="border-b p-2 ">
                      <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Write a caption..."
                        className="scrollbar-hide tracking wide h-16 md:h-40 w-full p-4 border-none outline-none placeholder:text-sm md:placeholder:text-sm"
                      ></textarea>
                      <AiOutlineSmile
                        onClick={() => setShowEmojis(prev => !prev)}
                        className="w-6 h-6 ml-2 cursor-pointer fill-gray-400"
                      />
                      {showEmojis && (
                        <div className="absolute bottom-0 right-0">
                          <EmojiPicker
                            onEmojiClick={addEmoji}
                            width={305}
                            height={300}
                            emojiStyle={EmojiStyle.FACEBOOK}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center p-3 border-b">
                      <input type="text" placeholder="Add location" />
                      <IoLocationOutline className="w-5 h-5" />
                    </div>
                    <div className="flex justify-between items-center p-3 border-b">
                      <p>Accessibility</p>
                      <MdKeyboardArrowDown className="w-5 h-5" />
                    </div>
                    <div className="flex justify-between items-center p-3 border-b">
                      <p>Advanced settings</p>
                      <MdKeyboardArrowDown className="w-5 h-5" />
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="48"
                  visible={true}
                />
              </div>
            )}
          </>
        )}

        {popupOpen && (
          <Popup
            mainText="Discard post?"
            text="If you leave, your edits won't be saved"
            buttonTextNo="Cancel"
            buttonTextYes="Discard"
          />
        )}
      </div>
    </>
  );
};

export default CreatePost;
