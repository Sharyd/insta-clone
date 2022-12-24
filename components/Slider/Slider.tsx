import React, { useState } from 'react';
import useSlider from '../../hooks/use-slider';
import { v4 as uuidv4 } from 'uuid';
import BtnSlider from './SliderBtn';

const data = [
  {
    userImg: 'user-1.jpeg',
    userId: uuidv4(),
  },
  {
    userImg: 'user-2.jpeg',
    userId: uuidv4(),
  },
  {
    userImg: 'user-3.jpeg',
    userId: uuidv4(),
  },
  {
    userImg: 'user-5.jpg',
    userId: uuidv4(),
  },
  {
    userImg: 'user-5.jpg',
    userId: uuidv4(),
  },
  {
    userImg: 'user-2.jpeg',
    userId: uuidv4(),
  },
  {
    userImg: 'user-1.jpeg',
    userId: uuidv4(),
  },
  {
    userImg: 'user-1.jpeg',
    userId: uuidv4(),
  },
  {
    userImg: 'user-1.jpeg',
    userId: uuidv4(),
  },
  {
    userImg: 'user-5.jpg',
    userId: uuidv4(),
  },
  {
    userImg: 'user-2.jpeg',
    userId: uuidv4(),
  },
  {
    userImg: 'user-2.jpeg',
    userId: uuidv4(),
  },
  {
    userImg: 'user-2.jpeg',
    userId: uuidv4(),
  },
  {
    userImg: 'user-2.jpeg',
    userId: uuidv4(),
  },
  {
    userImg: 'user-2.jpeg',
    userId: uuidv4(),
  },
  {
    userImg: 'user-2.jpeg',
    userId: uuidv4(),
  },
];
const Slider = () => {
  const calcNumberOfSliding = Math.floor((data.length * 65) / 255);
  const calcSpace = data.length * 40;
  const { prevSlide, nextSlide, slideIndex } = useSlider(calcNumberOfSliding);

  const calcfinal: any = slideIndex === calcNumberOfSliding ? '12.5' : '16';

  return (
    <div className="relative flex gap-4 py-4 border-[1px] mt-4 items-center justify-center rounded-md bg-white overflow-hidden">
      <div
        className="flex gap-2 md:gap-3 items-center justify-center transition ease-in-out duration-500 mr-[28rem] "
        style={{
          transform: `translateX(${-calcfinal * slideIndex}rem)`,
        }}
      >
        {data.map((img, index) => (
          <div
            key={img.userId}
            className={`flex items-center justify-center flex-col gap-2  `}
            style={{ transform: `translateX(${calcSpace}px)` }}
          >
            <img
              src={img.userImg}
              alt="user-profile"
              className=" w-12 h-12 md:w-14 md:h-14 rounded-full"
            />
            <p className="text-[0.68rem]">MichaelXXX</p>
          </div>
        ))}
      </div>

      {slideIndex !== calcNumberOfSliding && (
        <BtnSlider moveSlide={nextSlide} direction={'next'} />
      )}
      {slideIndex !== 0 && (
        <BtnSlider moveSlide={prevSlide} direction={'prev'} />
      )}
    </div>
  );
};

export default Slider;
