import {
  onSnapshot,
  orderBy,
  query,
  collection,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

import Post from "./Post";
import { db } from "../firebase";
import Slider from "./Slider/Slider";
import Suggestions from "./Suggestions";
const Feed = () => {
  const [posts, setPosts] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => setPosts(snapshot.docs)
      ),
    [db]
  );

  return (
    <section className="m-auto lg:flex mt-16 gap-4 md:mt-8 ">
      <div className="max-w-[380px]  sm:max-w-[440px]  ">
        <Slider />
        {posts.map((post) => (
          <Post key={post.id} id={post.id} post={post?.data()} modalPost />
        ))}
      </div>
      <div className="hidden lg:flex">
        <Suggestions />
      </div>
    </section>
  );
};

export default Feed;
