"use client";

import { HiOutlineUserGroup } from "react-icons/hi2";

const UserCard = ({
  name, 
  image, 
  unread = false, 
  online = false,
  isSelected = false,
  isGroup = false
}) => {

  return (
    <div 
      className={`
        flex items-center gap-3 p-3 rounded-xl transition-all duration-200
        ${isSelected 
          ? 'bg-[rgb(var(--primary)/0.1)] border border-[rgb(var(--primary)/0.3)]' 
          : 'hover:bg-surface-hover border border-transparent'
        }
      `}
    >
      {/* Avatar with online indicator */}
      <div className="relative flex-shrink-0">
        <img
          src={image || "/avatars/user.png"}
          alt={name}
          className={`
            w-12 h-12 rounded-xl object-cover
            ${isSelected ? 'ring-2 ring-[rgb(var(--primary))] ring-offset-2 ring-offset-[rgb(var(--surface))]' : ''}
          `}
        />
        {/* Online indicator */}
        {online && !isGroup && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[rgb(var(--online))] border-2 border-[rgb(var(--surface))] rounded-full" />
        )}
        {/* Group indicator */}
        {isGroup && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[rgb(var(--primary))] border-2 border-[rgb(var(--surface))] rounded-full flex items-center justify-center">
            <HiOutlineUserGroup className="w-3 h-3 text-white" />
          </span>
        )}
      </div>
      
      {/* Name and status */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className={`font-medium truncate ${isSelected ? 'text-[rgb(var(--primary))]' : 'text-primary'}`}>
            {name}
          </h4>
          {/* Unread indicator */}
          {unread && (
            <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-[rgb(var(--primary))] animate-pulse" />
          )}
        </div>
        <p className="text-sm text-tertiary truncate">
          {unread ? (
            <span className="text-[rgb(var(--primary))] font-medium">New messages</span>
          ) : online ? (
            <span className="text-[rgb(var(--online))]">Online</span>
          ) : isGroup ? (
            'Group chat'
          ) : (
            'Tap to chat'
          )}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
