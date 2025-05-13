import React from "react";
import { IoSearchOutline } from "react-icons/io5";
const SearchBox = ({ onSearch }) => {
  return (
    <div className="relative mb-4">
      <input type="text" placeholder="Search Song, Artist" className="bg-[#2c2c2c] w-full p-2.5 pl-10 rounded-md placeholder-gray-400 text-sm text-white    focus:outline-none focus:ring-0"
        onChange={(e) => onSearch(e.target.value)}/>
      <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[18px] text-gray-400" />
    </div>
  );
};
export default SearchBox;
