import React from 'react';

import Post from '../post/Post';

import Slider from '../stories/Slider';
import Suggestions from './Suggestions';
import useSnapshot from '../../hooks/use-snapshot';

const Feed = () => {
  const { value: posts } = useSnapshot('posts');

  return (
    <section className="m-auto lg:flex mt-16 gap-4 md:mt-8 ">
      <div className="max-w-[360px] sm:max-w-[460px]  ">
        <Slider />
        {posts.map(post => (
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
