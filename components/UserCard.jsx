"use client";

import { Badge } from "@chakra-ui/react";

const UserCard = ({
  name, 
  image, 
  className = "", 
  unread = false, 
  online = false
}) => {

  return (
    <div className={`flex w-full items-center p-2 ${className} rounded-2xl hover:bg-gray-100 relative cursor-pointer`}>
      <div className="flex items-center gap-4 cursor-pointer relative">
        <div className="relative">
          {/* Profile Image */}
          <img
            src={image || "/avatars/user.png"}
            alt={name}
            className="h-10 w-10 rounded-full"
          />
          {/* Online Indicator (Bot-like badge) */}
          {online && (
            <span className="absolute bottom-0 right-0 bg-green-500 border-2 border-white h-3 w-3 rounded-full" />
          )}
        </div>
        
        {/* Username */}
        <span className="font-medium">{name}</span>
      </div>

      {/* Unread Message Badge */}
      {unread && (
        <Badge 
          colorScheme="red" 
          className="ml-auto px-2 py-1 text-xs rounded-full"
          color="green"
        >
          New Messages
        </Badge>
      )}
    </div>
  );
};

export default UserCard;
