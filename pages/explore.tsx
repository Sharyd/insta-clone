import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { db } from "../firebase";
import PostsQuery from "../components/PostsQuery";
const explore = () => {
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
    <Layout>
      <div className="mt-20 md:mt-10 grid grid-cols-3 max-h-full max-w-[900px] m-auto gap-2 md:gap-6 p-2">
        {posts?.map((post) => (
          <PostsQuery key={post.id} post={post.data()} id={post.id} />
        ))}
      </div>
    </Layout>
  );
};

export default explore;
