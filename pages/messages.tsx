import React, { RefObject, useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import ChatUsers from "../components/chat/ChatUsers";
import { HiOutlineSearch } from "react-icons/hi";
import { BsTelephone, BsCameraVideo, BsImage } from "react-icons/bs";
import { AiOutlineInfoCircle, AiOutlineSmile } from "react-icons/ai";
import Message from "../components/chat/Message";
import EmojiPicker from "emoji-picker-react";
import { EmojiStyle } from "emoji-picker-react";
import useEmoji from "../hooks/use-emoji";
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
} from "firebase/firestore";

const Messages = () => {
  const [user, loading] = useAuthState(auth);
  const [users, setUsers] = useState<DocumentData[]>([]);
  const refFileToElement = useRef<HTMLInputElement>(null);
  const {
    text: message,
    setText: setMessage,
    addEmoji,
    resetEmojiAndText,
    showEmojis,
    setShowEmojis,
  } = useEmoji();

  useEffect(
    () =>
      onSnapshot(query(collection(db, "users")), (snapshot) =>
        setUsers(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      ),
    [db]
  );

  const sendMessage = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // await addDoc(collection(db, "posts", id, "comments"), {
    //   comment: comment,
    //   userId: user?.uid,
    //   username: user?.displayName,
    //   userImg: user?.photoURL,
    //   timestamp: serverTimestamp(),
    // });

    // setIsOpen(false);
    resetEmojiAndText();
  };

  return (
    <Layout>
      <section className="m-auto flex md:mt-16 items-center md:items-start text-[0.85rem] h-[700px] md:h-[800px] ">
        <div className="hidden md:flex relative bg-white flex-col h-full border">
          <div className="flex border-b  flex-col py-3 px-8 w-[250px] lg:w-[300px]">
            <p className="font-[500] p-2 px-4">{user?.displayName}</p>
            <div className="relative flex items-center mb-2 group">
              <div className="group-focus:hidden absolute bg-gray-100 w-10 h-10 flex items-center justify-center rounded-l-lg">
                <HiOutlineSearch className=" text-gray-400 bg-gray-100" />
              </div>
              <input
                className="focus:outline-none group-ml-0 bg-gray-100 ml-6  w-full p-4 h-10 rounded-lg placeholder:text-sm placeholder:font-thin"
                type="text"
                placeholder="Search users"
              />
            </div>
          </div>
          <div className="overflow-y-scroll scrollbar-hide">
            {users.map((user) => (
              <ChatUsers key={user.id} user={user} />
            ))}
          </div>
        </div>

        <div className="mt-4 w-[400px] md:w-[420px] lg:w-[540px] h-full md:mt-0 bg-white border border-l-0 ">
          <div className="p-2 md:p-[34px] px-4 border-b flex items-center justify-between  ">
            <div className="flex items-center gap-2">
              <img
                src="user-5.jpg"
                alt="user-profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-[500]">username</p>
                <span className="text-xs text-gray-400">Active 2h ago</span>
              </div>
            </div>
            <div className="flex gap-3">
              <BsTelephone className="w-6 h-6 text-gray-900 cursor-pointer" />
              <BsCameraVideo className="w-6 h-6 text-gray-900 cursor-pointer" />
              <AiOutlineInfoCircle className="w-6 h-6 text-gray-900 cursor-pointer" />
            </div>
          </div>

          <div className="max-h-[580px] md:max-h-[620px] overflow-y-scroll scrollbar-hide">
            <Message />
            <Message />
          </div>
          <form onSubmit={sendMessage}>
            <div className="relative flex items-center   justify-between px-2 border-t">
              <div className="flex gap-2 items-center justify-center">
                <AiOutlineSmile
                  onClick={() => setShowEmojis((prev) => !prev)}
                  className="w-6 h-6 cursor-pointer"
                />

                <textarea
                  placeholder="Add a message..."
                  className={`h-max outline-none text-sm resize-none mt-6 scrollbar-hide`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                {showEmojis && (
                  <div className="absolute bottom-16 right-0">
                    <EmojiPicker
                      onEmojiClick={addEmoji}
                      width={350}
                      height={350}
                      emojiStyle={EmojiStyle.FACEBOOK}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => refFileToElement?.current?.click()}>
                  <BsImage className="w-5 h-5 text-gray-700 " />
                  <input
                    type="file"
                    hidden
                    multiple
                    ref={refFileToElement}
                    // onChange={addImageToPost}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="disabled:text-[#bae6fd] textMainColor text-sm mr-2"
                >
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Messages;
