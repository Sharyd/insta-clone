import React, { useCallback, useEffect, useState } from 'react';

import Post from '../post/Post';

import Slider from '../stories/Slider';
import Suggestions from './suggestions/Suggestions';
import useSnapshot from '../../hooks/use-snapshot';
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Feed = () => {
  const [posts, setPosts] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [myPosts, setMyPosts] = useState<QueryDocumentSnapshot<DocumentData>[]>(
    []
  );
  const [loggedUser] = useAuthState(auth);
  const [followingUsers, setFollowingUsers] = useState<DocumentData[]>([]);

  const getFollowing = useCallback(() => {
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
    if (followingUsers.length !== 0) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, 'posts'),
          orderBy('timestamp', 'desc'),
          where('userid', 'in', followingUsers)
        ),
        snapshot => setPosts(snapshot.docs)
      );
      return () => unsubscribe();
    }
  }, [db, followingUsers]);

  useEffect(() => {
    if (!loggedUser?.uid) return;
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'posts'),
        orderBy('timestamp', 'desc'),
        where('userid', '==', loggedUser?.uid)
      ),
      snapshot => setMyPosts(snapshot.docs)
    );
    return () => unsubscribe();
  }, [db, loggedUser?.uid]);

  return (
    <section className="m-auto lg:flex mt-16 gap-4 md:mt-8 ">
      <div className="max-w-[360px] sm:max-w-[460px]  ">
        <Slider />
        {posts?.map(post => (
          <Post key={post.id} id={post.id} post={post.data()} modalPost />
        ))}
        {myPosts?.map(post => (
          <Post key={post.id} id={post.id} post={post.data()} modalPost />
        ))}
        {myPosts?.length === 0 && posts?.length === 0 ? (
          <p className="text-center m-auto p-16">
            Start following someone and see their posts! Or create your own
            posts.
          </p>
        ) : (
          ''
        )}
      </div>
      <div className="hidden lg:flex">
        <Suggestions followingUsers={followingUsers} />
      </div>
    </section>
  );
};

export default Feed;
