import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
const Footer = () => {
  const getFullYear = new Date().getFullYear();

  return (
    <footer className="px-10 bg-gray-100 flex-1 flex flex-col items-center justify-center text-xs text-gray-400 gap-4">
      <ul className="flex justify-center flex-wrap gap-3 items-center">
        <li>
          <a href="#">Meta</a>
        </li>
        <li>
          <a href="#">About</a>
        </li>
        <li>
          <a href="#">Blog</a>
        </li>
        <li>
          <a href="#">Help</a>
        </li>
        <li>
          <a href="#">API</a>
        </li>
        <li>
          <a href="#">Privacy</a>
        </li>
        <li>
          <a href="#">Terms</a>
        </li>

        <li>
          <a href="#">Top Accounts</a>
        </li>
        <li>
          <a href="#">Hashtags</a>
        </li>
        <li>
          <a href="#">Locations</a>
        </li>
        <li>
          <a href="#">Instagram Lite</a>
        </li>
        <li>
          <a href="#">Contact Uploading & Non-Users</a>
        </li>
      </ul>
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center">
          <p>English</p>
          <MdKeyboardArrowDown className="w-5 h-5 " />
        </div>
        <p>&copy; {getFullYear} Instagram Clone for education purposies </p>
      </div>
    </footer>
  );
};

export default Footer;
