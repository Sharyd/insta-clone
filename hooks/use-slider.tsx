import React, { useState } from "react";

const useSlider = (lastItem: number) => {
  const [slideIndex, setSlideIndex] = useState(0);

  const nextSlide = () => {
    if (slideIndex !== lastItem) {
      setSlideIndex(slideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (slideIndex !== 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  return {
    setSlideIndex,
    prevSlide,
    nextSlide,
    slideIndex,
  };
};

export default useSlider;
