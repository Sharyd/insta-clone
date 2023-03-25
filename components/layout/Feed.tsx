import React, { useCallback, useEffect, useState } from 'react';

import Post from '../post/Post';

import Slider from '../stories/Slider';
import Suggestions from './suggestions/Suggestions';

import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import useIsDefaultText from '../../hooks/use-isDefaultText';

const Feed = () => {
  const [posts, setPosts] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  const [loggedUser] = useAuthState(auth);
  const [followingUsers, setFollowingUsers] = useState<DocumentData[]>([]);
  const { message } = useIsDefaultText({ posts, followingUsers });

  const getFollowing = useCallback(() => {
    if (!loggedUser?.uid) return;
    const unsubscribe = onSnapshot(
      query(collection(db, 'users'), where('uid', '==', loggedUser?.uid)),
      snapshot => {
        setFollowingUsers(snapshot.docs.flatMap(user => user.data().following));
      }
    );
    return unsubscribe;
  }, [db, loggedUser?.uid]);

  useEffect(() => getFollowing(), [getFollowing]);

  useEffect(() => {
    if (!loggedUser?.uid) return;
    if (followingUsers.length !== 0 || loggedUser?.uid) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, 'posts'),
          orderBy('timestamp', 'desc'),
          where('userid', 'in', [...followingUsers, loggedUser?.uid])
        ),
        snapshot => setPosts(snapshot.docs)
      );
      return () => unsubscribe();
    }
  }, [db, followingUsers, loggedUser?.uid]);

  return (
    <section className="m-auto lg:flex mt-16 gap-4 md:mt-8 ">
      <div className="max-w-[360px] sm:max-w-[460px]  ">
        <Slider />

        {message ? (
          <p className="text-center m-auto p-16">
            Start following someone and see their posts! Or create your own
            posts.
          </p>
        ) : (
          <>
            {posts?.map(post => (
              <Post key={post.id} id={post.id} post={post.data()} modalPost />
            ))}
          </>
        )}
      </div>
      <div className="hidden lg:flex">
        <Suggestions followingUsers={followingUsers} />
      </div>
    </section>
  );
};

export default Feed;
