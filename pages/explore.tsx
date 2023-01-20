import React from 'react';
import Layout from '../components/layout/Layout';

import PostsPreview from '../components/post/PostsPreview';

import LoadingSpinner from '../components/ui/LoadingSpinner';
import useSnapshot from '../hooks/use-snapshot';
const explore = () => {
  const { value: posts } = useSnapshot('posts');

  return (
    <Layout>
      {posts.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-20 md:mt-10 grid grid-cols-3 max-h-full max-w-[900px] m-auto gap-2 md:gap-6 p-2">
          {posts?.map(post => (
            <PostsPreview key={post.id} post={post.data()} id={post.id} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default explore;
