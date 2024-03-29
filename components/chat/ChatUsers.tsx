import {
  doc,
  DocumentData,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import React, { Dispatch, SetStateAction } from 'react';
import { auth, db } from '../../firebase/firebase';

interface Props {
  user: DocumentData;
  setUsername: Dispatch<SetStateAction<string>>;
  username: string;
  setUser: Dispatch<SetStateAction<null | DocumentData>>;
}

const ChatUsers = ({ user, setUsername, setUser }: Props) => {
  const [loggedUser] = useAuthState(auth);
  const currentUser: any = loggedUser;

  const handleSelectUser = async () => {
    const combinedId =
      currentUser?.uid > user?.uid
        ? currentUser?.uid + user?.uid
        : user?.uid + currentUser?.uid;

    try {
      const res = await getDoc(doc(db, 'chats', combinedId));

      if (!res.exists()) {
        // create a chat in chats collection
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });
        //create user chats
        await updateDoc(doc(db, 'userChat', currentUser.uid), {
          [combinedId + '.userInfo']: {
            uid: user?.uid,
            displayName: user?.displayName,
            photoURL: user?.photoURL ?? null,
          },
          [combinedId + '.date']: serverTimestamp(),
        });

        await updateDoc(doc(db, 'userChat', user.uid), {
          [combinedId + '.userInfo']: {
            uid: currentUser?.uid,
            displayName: currentUser?.displayName,
            photoURL: currentUser?.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });
      }

      setUser(null);
      setUsername('');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      onClick={handleSelectUser}
      className={`py-2 px-6 items-center gap-3 w-full hover:bg-gray-100 cursor-pointer`}
    >
      <div className="flex gap-3 items-center">
        <img
          src={user?.photoURL}
          alt="user profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <p className="font-[500]">{user?.displayName}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatUsers;
