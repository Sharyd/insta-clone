import React, {
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
  FormEvent,
} from 'react';
import Layout from '../components/Layout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '../firebase';
import ChatUsers from '../components/chat/ChatUsers';
import { BsTelephone, BsCameraVideo, BsImage } from 'react-icons/bs';
import { AiOutlineInfoCircle, AiOutlineSmile } from 'react-icons/ai';
import Message from '../components/chat/Message';
import EmojiPicker from 'emoji-picker-react';
import { EmojiStyle } from 'emoji-picker-react';
import useEmoji from '../hooks/use-emoji';
import CombinedUsers from '../components/chat/ExistingUsers';
import {
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { ChatContext } from '../store/ChatContext';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { MdOutlineKeyboardArrowUp } from 'react-icons/md';
import InputSearch from '../components/chat/InputSearch';
import { motion } from 'framer-motion';

const Messages = () => {
  const [userr, loading] = useAuthState(auth);
  const [error, setError] = useState<unknown>(false);
  const [username, setUsername] = useState('');
  const [chats, setChats] = useState<DocumentData | undefined>([]);
  const [user, setUser] = useState<DocumentData | null>(null);
  const refFileToElement = useRef<HTMLInputElement>(null);
  const { data } = useContext(ChatContext);
  const [hideFooter, setHideFooter] = useState(true);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const enterRef = useRef();

  const [img, setImg] = useState<File | null>(null);
  const [messages, setMessages] = useState<any>([]);

  const currentUser: any = userr;
  const {
    text: message,
    setText: setMessage,
    addEmoji,
    resetEmojiAndText,
    showEmojis,
    setShowEmojis,
  } = useEmoji();

  const handleSearch = async () => {
    const q = query(
      collection(db, 'users'),
      where('displayName', '==', username)
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => {
        setUser(doc.data());
      });
    } catch (err) {
      setError(true);
    }
  };

  const handleKey = (e: { code: string }) => {
    e.code === 'Enter' && handleSearch();
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (img) {
        const storageRef = ref(storage, uuid());

        await uploadBytesResumable(storageRef, img).then(() => {
          getDownloadURL(storageRef).then(async downloadURL => {
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: message,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        });
      } else {
        await updateDoc(doc(db, 'chats', data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text: message,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      }
    } catch (err) {
      setError(err);
    }

    await updateDoc(doc(db, 'userChat', currentUser?.uid), {
      [data.chatId + '.lastMessage']: {
        message,
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    await updateDoc(doc(db, 'userChat', data?.user?.uid), {
      [data.chatId + '.lastMessage']: {
        message,
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    resetEmojiAndText();
    setImg(null);
    setError(null);
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'chats', data.chatId), doc => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => unsub();
  }, [data?.chatId]);

  return (
    <Layout hideFooter={hideFooter}>
      <section className="m-auto p-2 flex md:mt-16 items-center md:items-start text-[0.85rem] md:h-[800px] ">
        <div className="hidden md:flex relative bg-white flex-col h-full border">
          <div className="flex border-b flex-col py-3 px-8 w-[250px] lg:w-[300px]">
            <p className="font-[500] p-2 px-4">{currentUser?.displayName}</p>
            <div className="relative flex items-center mb-2 group">
              <InputSearch
                setUsername={setUsername}
                username={username}
                handleKey={handleKey}
              />
            </div>
          </div>
          <div className="h-[100px]">
            <h2 className="font-[500] text-md mb-4 pt-2 px-4"></h2>

            {user && (
              <ChatUsers
                user={user}
                setUsername={setUsername}
                username={username}
                setUser={setUser}
              />
            )}
          </div>
          <div className="border-t overflow-y-scroll scrollbar-hide">
            <h2 className="font-[500] text-md mb-4 pt-2 px-4">
              Existing chats
            </h2>
            <CombinedUsers />
          </div>
        </div>

        <div className="relative mt-4 w-[400px] md:w-[420px] lg:w-[540px] h-full md:mt-0 bg-white border border-l-0 ">
          <div className="p-3 md:p-[37px] px-4 border-b flex items-center justify-between ">
            <div className="flex items-center gap-2">
              {data?.user && (
                <img
                  src={
                    data?.user?.photoURL === undefined
                      ? 'https://graph.facebook.com/9002313636460828/picture' ??
                        ''
                      : data?.user?.photoURL ?? ''
                  }
                  alt="user-profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-[500]">
                  {data?.user !== undefined
                    ? data?.user?.displayName
                    : 'User not selected'}
                </p>
              </div>
            </div>

            <div className="md:hidden">
              {!showSearchInput ? (
                <MdOutlineKeyboardArrowRight
                  onClick={() => setShowSearchInput(true)}
                  className="w-5 h-5 ml-16 text-gray-800 cursor-pointer"
                />
              ) : (
                <MdOutlineKeyboardArrowUp
                  onClick={() => setShowSearchInput(false)}
                  className="w-5 h-5 ml-16 text-gray-800 cursor-pointer"
                />
              )}
            </div>
            {showSearchInput && (
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                exit={{ y: '-20%', opacity: 0.5 }}
                className="md:hidden absolute top-[52px] left-0 max-h-[400px] bg-white flex-col  w-max border-r z-10 overflow-y-auto"
              >
                <div className="relative flex items-center px-2 mt-4 group">
                  <InputSearch
                    setUsername={setUsername}
                    username={username}
                    handleKey={handleKey}
                  />
                </div>

                <div className="h-[100px]">
                  <h2 className="font-[500] text-md mb-4 pt-2 px-4"></h2>

                  {user && (
                    <ChatUsers
                      user={user}
                      setUsername={setUsername}
                      username={username}
                      setUser={setUser}
                    />
                  )}
                </div>
                <div className="border-t overflow-y-scroll scrollbar-hide  border-b">
                  <h2 className="font-[500] text-md mb-4 pt-2 px-4">
                    Existing chats
                  </h2>
                  <CombinedUsers />
                </div>
              </motion.div>
            )}

            <div className="flex gap-3">
              <BsTelephone className="w-6 h-6 text-gray-900 cursor-pointer" />
              <BsCameraVideo className="w-6 h-6 text-gray-900 cursor-pointer" />
              <AiOutlineInfoCircle className="w-6 h-6 text-gray-900 cursor-pointer" />
            </div>
          </div>

          <div className="h-[390px] md:h-[620px] overflow-y-scroll scrollbar-hide -z-20">
            {messages.map((m: DocumentData) => (
              <Message message={m} key={m?.id} />
            ))}
          </div>
          <form onSubmit={handleSend}>
            <div className="relative w-full flex items-center justify-between px-2 border-t">
              <div className="flex w-full gap-2 items-center justify-center py-4 ">
                <AiOutlineSmile
                  onClick={() => setShowEmojis(prev => !prev)}
                  className="w-6 h-6 cursor-pointer"
                />

                <input
                  type="text"
                  placeholder="Add a message..."
                  className={`h-max outline-none text-sm w-full`}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
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
              <div className="flex items-center gap-3 cursor-pointer py-4 ">
                <div onClick={() => refFileToElement?.current?.click()}>
                  <BsImage className="w-5 h-5 text-gray-700 " />
                  <input
                    type="file"
                    hidden
                    multiple
                    ref={refFileToElement}
                    onChange={(e: any) => setImg(e.target.files[0])}
                  />
                </div>
                <button
                  type="submit"
                  disabled={
                    !message.trim() ||
                    !img ||
                    data?.user.displayName === undefined
                  }
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
