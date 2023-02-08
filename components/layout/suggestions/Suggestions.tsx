import React, { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  setDoc,
  where,
} from 'firebase/firestore';
import useSnapshotWithId from '../../../hooks/use-snapshotWithId';
import useIsAlreadySet from '../../../hooks/use-isAlreadySet';
import { useRecoilState } from 'recoil';

import SuggestedProfile from './SuggestedProfile';
const Suggestions = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const getFullYear = new Date().getFullYear();
  const [users, setUsers] = useState<DocumentData[]>([]);
  const [singleUserId, setSingleUserId] = useState('');

  // const [following, setFollowing] = useState<DocumentData[]>([]);

  // this is not finished !

  // const getFollowing = useCallback(() => {
  //   const unsubscribe = onSnapshot(
  //     query(collection(db, 'users'), where('uid', '==', user?.uid)),
  //     snapshot => {
  //       setFollowing(snapshot.docs.flatMap(user => user.data().following));
  //     }
  //   );
  //   return unsubscribe;
  // }, [db, user?.uid]);

  // useEffect(() => getFollowing(), [getFollowing]);

  // console.log(singleUserId);

  // const { value: isFollowing } = useIsAlreadySet(following, user?.uid ?? '');

  useEffect(() => {
    if (!user?.uid) return;
    onSnapshot(
      query(collection(db, 'users'), limit(4), where('uid', '!=', user?.uid)),
      snapshot => setUsers(snapshot.docs.map(users => users.data()))
    ),
      [db, user?.uid];
  });

  return (
    <div className="flex flex-col text-[0.7rem] mt-10 ml-4 w-[325px] text-gray-700">
      <div className="flex flex-col">
        <div className="flex items-center">
          <Link
            href={`/${user?.uid}`}
            className="flex items-center cursor-pointer"
          >
            <img
              src={
                user?.photoURL === null
                  ? 'https://graph.facebook.com/9002313636460828/picture'
                  : user?.photoURL
              }
              alt="user-profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex flex-col ml-4">
              <p className="font-[500] text-[0.8rem]">{user?.displayName}</p>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </Link>
          <button
            onClick={() => {
              auth.signOut();
              router.push('/');
            }}
            className="ml-auto text-[0.7rem] font-[500] textMainColor"
          >
            Switch
          </button>
        </div>
        <div className="flex items-center justify-between mt-4 gap-4 mb-4">
          <h3 className="text-gray-500 font-[500] text-[0.8rem] tracking-wide">
            Suggestions For You
          </h3>
          <button className="text-gray-800">See All</button>
        </div>
        {users?.map((suggestUser: DocumentData) => (
          <SuggestedProfile
            key={suggestUser.uid}
            photoURL={suggestUser.photoURL}
            uid={suggestUser.uid}
            displayName={suggestUser.displayName}
            email={suggestUser.email}
          />
        ))}

        <nav className="mt-6 text-gray-400 opacity-60 text-[0.65rem] ">
          <ul className="flex gap-2 flex-wrap">
            <li className="hover:underline">
              <a href="#">About</a>
            </li>
            <li className="hover:underline">
              <a href="#">Help</a>
            </li>
            <li className="hover:underline ">
              <a href="#">Press</a>
            </li>
            <li className="hover:underline">
              <a href="#">API</a>
            </li>
            <li className="hover:underline">
              <a href="#">Jobs</a>
            </li>
            <li className="hover:underline">
              <a href="#">Privacy</a>
            </li>
            <li className="hover:underline">
              <a href="#">Terms</a>
            </li>
            <li className="hover:underline">
              <a href="#">Locations</a>
            </li>
            <li className="hover:underline">
              <a href="#">Language</a>
            </li>
          </ul>
        </nav>
        <p className="mt-5 text-gray-400 opacity-60 text-[0.7rem]">
          &copy; {getFullYear} INSTAGRAM CLONE FOR EDUCATION PURPOSIES
        </p>
      </div>
    </div>
  );
};

export default Suggestions;
