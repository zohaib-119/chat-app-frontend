'use client';

import { useState } from 'react';
import SearchBar from './Searchbar';
import UserCard from './UserCard';
import groupImages from '@/public/group_images';
import { toaster } from './ui/toaster';
import { 
  HiOutlineXMark, 
  HiOutlineUserGroup,
  HiOutlineCheck,
  HiOutlineUserPlus
} from 'react-icons/hi2';

const GroupCreationModal = ({ isOpen, onClose, onCreateGroup, search, handleSearchChange, searchedUsers }) => {
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleAddMember = (user) => {
    if (!groupMembers.find((m) => m._id === user._id)) {
      setGroupMembers([...groupMembers, { _id: user._id, username: user.username }]);
    }
  };

  const handleRemoveMember = (userId) => {
    setGroupMembers(groupMembers.filter((m) => m._id !== userId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toaster.create({
        title: "Please enter a group name",
        type: 'error',
      });
      return;
    }

    if (!groupImage) {
      toaster.create({
        title: "Please select a group image",
        type: 'error',
      });
      return;
    }

    if (groupMembers.length === 0) {
      toaster.create({
        title: "Please add at least one member",
        type: 'error',
      });
      return;
    }

    setIsCreating(true);
    await onCreateGroup({
      groupName,
      groupImage,
      groupMembers
    });
    setIsCreating(false);

    // Reset after creation
    setGroupName('');
    setGroupImage('');
    setGroupMembers([]);
    onClose();
  };

  const handleClose = () => {
    setGroupName('');
    setGroupImage('');
    setGroupMembers([]);
    handleSearchChange('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-slide-up flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-theme flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <HiOutlineUserGroup className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary">Create Group</h2>
              <p className="text-sm text-tertiary">Start a conversation with multiple people</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-surface-hover transition-colors text-secondary"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Group Name
            </label>
            <input
              type="text"
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="
                w-full px-4 py-3 rounded-xl
                bg-secondary border border-theme
                text-primary placeholder:text-tertiary
                focus:border-[rgb(var(--primary))] focus:ring-2 focus:ring-[rgb(var(--primary)/0.1)]
                outline-none transition-all duration-200
              "
            />
          </div>

          {/* Group Image Selection */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Group Image
            </label>
            <div className="flex flex-wrap gap-3">
              {groupImages.map((avatar) => (
                <button
                  key={avatar.name}
                  onClick={() => setGroupImage(avatar.src)}
                  className={`
                    relative w-16 h-16 rounded-xl overflow-hidden transition-all duration-200
                    ${groupImage === avatar.src 
                      ? 'ring-4 ring-[rgb(var(--primary))] scale-95' 
                      : 'ring-2 ring-transparent hover:ring-[rgb(var(--border))] hover:scale-95'
                    }
                  `}
                >
                  <img
                    src={avatar.src}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                  />
                  {groupImage === avatar.src && (
                    <div className="absolute inset-0 bg-[rgb(var(--primary))] bg-opacity-20 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[rgb(var(--primary))] flex items-center justify-center">
                        <HiOutlineCheck className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search Users */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Add Members
            </label>
            <SearchBar
              placeholder="Search users to add..."
              value={search}
              onChange={(value) => handleSearchChange(value)}
            />
          </div>

          {/* Search Results */}
          <div className="max-h-40 overflow-y-auto rounded-xl border border-theme bg-secondary">
            {searchedUsers.length > 0 ? (
              <div className="p-2 space-y-1">
                {searchedUsers.map((user) => {
                  const isAdded = groupMembers.some(member => member._id === user._id);
                  return (
                    <div
                      key={user._id}
                      onClick={() => handleAddMember(user)}
                      className={`
                        flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors
                        ${isAdded ? 'bg-[rgb(var(--primary)/0.1)]' : 'hover:bg-surface-hover'}
                      `}
                    >
                      <img 
                        src={user.profile_pic || '/avatars/user.png'} 
                        alt={user.username}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <span className="flex-1 font-medium text-primary">{user.username}</span>
                      {isAdded ? (
                        <span className="text-[rgb(var(--primary))]">
                          <HiOutlineCheck className="w-5 h-5" />
                        </span>
                      ) : (
                        <span className="text-tertiary">
                          <HiOutlineUserPlus className="w-5 h-5" />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <HiOutlineUserPlus className="w-8 h-8 text-tertiary mb-2" />
                <p className="text-sm text-tertiary">
                  {search ? 'No users found' : 'Search for users to add'}
                </p>
              </div>
            )}
          </div>

          {/* Selected Members */}
          {groupMembers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Selected Members ({groupMembers.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {groupMembers.map((member) => (
                  <div 
                    key={member._id} 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))]"
                  >
                    <span className="text-sm font-medium">{member.username}</span>
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      className="hover:text-[rgb(var(--unread))] transition-colors"
                    >
                      <HiOutlineXMark className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-theme flex-shrink-0">
          <button
            onClick={handleCreateGroup}
            disabled={isCreating || !groupName.trim() || !groupImage || groupMembers.length === 0}
            className="
              btn btn-primary w-full py-3
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isCreating ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating...</span>
              </div>
            ) : (
              <>
                <HiOutlineUserGroup className="w-5 h-5" />
                <span>Create Group</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCreationModal;
