"use client";

import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { useState } from "react";

const SearchBar = ({ placeholder = "Find user...", value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || "");

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange && onChange(newValue);
  };

  const clearInput = () => {
    setInputValue("");
    onChange && onChange("");
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className="w-full pl-10 pr-12 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none shadow-sm"
      />
      <AiOutlineSearch className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      {inputValue && (
        <button onClick={clearInput} className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700">
          <AiOutlineClose className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
