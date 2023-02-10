import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useState, useEffect, useContext } from 'react';
import { auth, db } from '../../firebase/firebase';
import { ChatContext } from '../../store/ChatContext';

const CombinedUsers = () => {
  const [loggedUser] = useAuthState(auth);
  const [chats, setChats] = useState<DocumentData | undefined>([]);
  const currentUser: any = loggedUser;
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChat', currentUser?.uid), doc => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };
    currentUser?.uid && getChats();
  }, [currentUser?.uid]);

  const handleSelect = (user: Object) => {
    dispatch({ type: 'CHANGE_USER', payload: user });
  };

  return (
    <>
      {chats && (
        <div>
          {Object.entries(chats)
            ?.sort((a: DocumentData, b: DocumentData) => b[1].date - a[1].date)
            .map((chat: DocumentData) => (
              <div
                onClick={() => handleSelect(chat[1]?.userInfo)}
                key={chat[0]}
                className="flex py-2 px-6 items-center gap-3 w-full hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex gap-3 items-center">
                  <img
                    src={
                      chat[1]?.userInfo?.photoURL ??
                      'https://graph.facebook.com/9002313636460828/picture'
                    }
                    alt="user profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <p className="font-[500]">
                      {chat[1]?.userInfo?.displayName}
                    </p>
                    <p className="text-gray-400">
                      {chat[1]?.lastMessage?.message.slice(0, 10)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default CombinedUsers;
