"use client";

import { HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";

const SearchBar = ({ placeholder = "Search...", value, onChange }) => {

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const clearInput = () => {
    onChange("");
  };

  return (
    <div className="relative w-full">
      <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="
          w-full pl-11 pr-10 py-3 rounded-xl
          bg-secondary border border-theme
          text-primary placeholder:text-tertiary
          focus:border-[rgb(var(--primary))] focus:ring-2 focus:ring-[rgb(var(--primary)/0.1)]
          outline-none transition-all duration-200
        "
      />
      {value && (
        <button 
          onClick={clearInput} 
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-tertiary hover:text-secondary hover:bg-surface-hover transition-colors"
        >
          <HiOutlineXMark className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
