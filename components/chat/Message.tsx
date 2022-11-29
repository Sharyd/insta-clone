import React from "react";

const Message = () => {
  return (
    <div className="flex flex-col ">
      <span className="text-center p-4 text-gray-400">
        september 30, 2022 1:03 pm
      </span>
      <div className="flex flex-col gap-2 p-4">
        <img
          src="gal-7.jpeg"
          alt=""
          className="h-[300px] w-[200px] object-contain bg-black rounded-lg ml-4 "
        />
        <div className="flex items-center gap-2">
          <img
            src="user-5.jpg"
            alt=""
            className="w-8 h-8 rounded-full object-cover mt-auto"
          />
          <div className="border p-3 rounded-full">
            <p>text text</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
