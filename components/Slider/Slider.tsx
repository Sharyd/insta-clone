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
  const calcNumberOfSliding = Math.floor((data.length * 63) / 250);
  const calcSpace = data.length * 40;
  const { prevSlide, nextSlide, slideIndex } = useSlider(calcNumberOfSliding);
  const lastItemCalc = (255 * slideIndex + 50).toString();
  const calcfinal: any = slideIndex === calcNumberOfSliding ? '205' : '255';

  return (
    <div className="relative flex gap-4 px-10 py-4 border-[1px] mt-4 items-center justify-center rounded-md bg-white overflow-hidden">
      <div
        className="flex gap-3 items-center justify-center transition ease-in-out duration-500 mr-[28rem] "
        style={{
          transform: `translateX(${-calcfinal * slideIndex}px)`,
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
              className="w-14 h-14 rounded-full"
            />
            <p className="text-[0.7rem]">MichaelXXX</p>
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
