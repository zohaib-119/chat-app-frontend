"use client";

import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-primary">
      {/* Animated Logo */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center animate-pulse">
          <HiOutlineChatBubbleLeftRight className="w-10 h-10 text-white" />
        </div>
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-2xl gradient-primary opacity-30 animate-ping" />
      </div>
      
      {/* Loading text */}
      <p className="text-secondary font-medium animate-pulse">{text}</p>
      
      {/* Loading dots */}
      <div className="flex gap-1.5 mt-4">
        <div className="w-2 h-2 rounded-full bg-[rgb(var(--primary))] animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-[rgb(var(--primary))] animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-[rgb(var(--primary))] animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export default Loading;
