import { useState, useEffect } from 'react';
import React from 'react';
import dataImg from '../lib/dataImg';
const MobileImages = () => {
  const [img, setImg] = useState(1);

  const nextImg = () => {
    if (img !== dataImg.length) {
      setImg(prevImg => prevImg + 1);
    } else if (img === dataImg.length) {
      setImg(1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      nextImg();
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  });
  return (
    <div className="relative bg-gray-100 w-full hidden lg:block h-full ">
      <img src="loginMain.png" alt="phone image" className="w-full h-full" />
      <div className="">
        {dataImg.map((item, i) => (
          <img
            key={item.id}
            src={`screenshot${i + 1}.png`}
            alt="Image in the phone"
            className={`absolute top-6 right-[3.5rem] ${
              img === i + 1 ? 'animate-imgAnimate' : 'invisible'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileImages;
