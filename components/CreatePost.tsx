import React, { useState, useRef, MouseEventHandler, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { BiArrowBack } from "react-icons/bi";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoLocationOutline } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { AiOutlinePlusCircle, AiOutlineSmile } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import BtnSlider from "./Slider/SliderBtn";
import { auth } from "../firebase";

import useSlider from "../hooks/use-slider";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { storage, db } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Popup from "./ui/Popup";
import { modalState, popupState } from "../atoms/modalAtom";
import { getSelectedImgLengthState } from "../atoms/postAtom";
import { useRecoilState } from "recoil";
import { RotatingLines } from "react-loader-spinner";
import useEmoji from "../hooks/use-emoji";
import EmojiPicker from "emoji-picker-react";
import { EmojiStyle } from "emoji-picker-react";
const CreatePost = () => {
  const [selectedFilesURL, setSelectedFilesURL] = useState<any>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useRecoilState(popupState);
  const [lengthItems] = useState(selectedFilesURL.length);
  const [selectedImgLength, setSelectedImgLength] = useRecoilState(
    getSelectedImgLengthState
  );
  const [next, setNext] = useState(false);
  const refFileToElement = useRef<any>(null);
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

  const addImageToPost = (e: any) => {
    if (e.target.files[0]) {
      setSelectedFile(URL.createObjectURL(e.target.files[0]));
      setSelectedFilesURL((prev: string[]) => [
        ...prev,
        {
          id: uuidv4(),
          files: URL.createObjectURL(e.target.files[0]),
          images: e.target.files[0],
        },
      ]);
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
    setSlideIndex((prev) => prev - 1);
  };

  const sendData = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: user?.uid,
      username: user?.displayName,
      userImg:
        user?.photoURL === null
          ? "https://graph.facebook.com/9002313636460828/picture"
          : user?.photoURL,
      text: text,
      timestamp: serverTimestamp(),
    });

    if (selectedFilesURL.length !== 0) {
      const promises: any[] = [];

      selectedFilesURL?.map((file: { images: File }) => {
        const storageRef = ref(
          storage,
          `posts/${docRef?.id}/${file.images.name}`
        );
        return promises.push(
          uploadBytes(storageRef, file.images).then((uploadResult) => {
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
            image: photos.map((url) => url),
          },
          { merge: true }
        ).then((r) => {
          console.log("done");
        });
      } catch (err) {
        alert(err);
      }
    }

    setLoading(false);
    resetEmojiAndText();
    setNext(false);
    setSelectedFile(null);
    setSelectedFilesURL([]);
  };
  console.log(slideIndex);
  // xl:w-[825px] xl:h-[875px] lg:w-[625px] lg:h-[675px] md:w-[425px] md:h-[475px] w-[350px] h-[375px]
  return (
    <>
      <div
        className={`${
          next ? "xl:w-[1000px] lg:w-[925px] md:w-[760px] w-[350px] " : ""
        }  h-[40rem] ${
          selectedFilesURL.length === 0 && "w-[42.5rem]"
        }  w-full bg-white rounded-xl text-gray-800`}
      >
        {selectedFilesURL.length === 0 && (
          <>
            <h2 className="text-center p-2 w-full border-b font-semibold">
              Create a new post
            </h2>
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <svg
                aria-label="Icon to represent media such as images or videos"
                color="#262626"
                fill="#262626"
                height="77"
                role="img"
                viewBox="0 0 97.6 77.3"
                width="96"
              >
                <path
                  d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                  fill="currentColor"
                ></path>
                <path
                  d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                  fill="currentColor"
                ></path>
                <path
                  d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                  fill="currentColor"
                ></path>
              </svg>
              <h2 className=" text-xl  sm:text-2xl font-thin">
                Drag photos and videos here
              </h2>
              <div
                onClick={() => refFileToElement.current.click()}
                className="text-sm mainColor text-white py-1.5 px-2.5 font-semibold rounded-[4px] cursor-pointer"
              >
                <p>Select from computer</p>
                <input
                  type="file"
                  hidden
                  ref={refFileToElement}
                  multiple
                  onChange={addImageToPost}
                />
              </div>
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
                  onClick={sendData}
                >
                  Share
                </button>
              )}
            </div>
            {!loading ? (
              <div className="flex border-t flex-col md:flex-row">
                <div className="relative">
                  <div className="relative h-[20.5rem] w-[21.9rem] md:h-[38rem] md:w-[32.5rem] lg:h-[40.5rem] lg:w-[42rem]  overflow-hidden">
                    {selectedFilesURL?.map(
                      (data: { id: string; files: string }, index: number) => (
                        <>
                          <div className="relative">
                            {slideIndex === index && (
                              <div
                                key={data.id}
                                className="absolute h-[20.5rem] w-[21.9rem] md:h-[38rem] md:w-[32.5rem] lg:h-[40.5rem] lg:w-[45rem] object-cover "
                                style={{
                                  backgroundImage: `url(${data.files})`,
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "cover",
                                  backgroundPosition: "center center",
                                }}
                              >
                                <div className="absolute right-0 m-2 lg:mr-16 lg:m-4 flex items-center justify-center bg-black/60 h-7 w-7 rounded-full cursor-pointer hover:opacity-80 transition-all">
                                  <AiOutlineClose
                                    onClick={() => {
                                      removeItemFromSlider(data.id);

                                      selectedFilesURL.length === 1 &&
                                        setSelectedFile(null);
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
                      <BtnSlider moveSlide={nextSlide} direction={"next"} />
                    )}
                    {slideIndex !== 0 && (
                      <BtnSlider moveSlide={prevSlide} direction={"prev"} />
                    )}
                    <div className="flex gap-2">
                      {selectedFilesURL.length > 1 &&
                        selectedFilesURL.map((_: string, index: number) => (
                          <div
                            key={index}
                            onClick={() => moveDot(index)}
                            className={`w-2 h-2 flex relative rounded-full -bottom-[38rem] left-1/2 bg-gray-100 cursor-pointer z-50 ${
                              slideIndex === index && "bg-blue-500"
                            }`}
                          ></div>
                        ))}
                    </div>
                  </div>

                  {!next && (
                    <div
                      onClick={() => refFileToElement.current.click()}
                      className="flex items-center justify-center absolute bottom-4 right-4 bg-black/60 h-10 w-10 rounded-full cursor-pointer hover:opacity-80 transition-all"
                    >
                      <AiOutlinePlusCircle className="w-7 h-7 text-white" />
                      <input
                        type="file"
                        hidden
                        multiple
                        ref={refFileToElement}
                        onChange={addImageToPost}
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
                        src={user?.photoURL ?? ""}
                        alt="profile-img"
                        className="w-7 h-7 rounded-full overflow-hidden "
                      />
                      <p>{user?.displayName}</p>
                    </div>
                    <div className="border-b p-2 ">
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write a caption..."
                        className="scrollbar-hide tracking wide h-16 md:h-40 w-full p-4 border-none outline-none placeholder:text-sm md:placeholder:text-sm"
                      ></textarea>
                      <AiOutlineSmile
                        onClick={() => setShowEmojis((prev) => !prev)}
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
          <>
            <Popup
              mainText="Discard post?"
              text="If you leave, your edits won't be saved"
            />
          </>
        )}
      </div>
    </>
  );
};

export default CreatePost;
