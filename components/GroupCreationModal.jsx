'use client';

import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import SearchBar from './Searchbar';
import UserCard from './UserCard';
import groupImages from '@/public/group_images';
import { toaster } from './ui/toaster';

const GroupCreationModal = ({ isOpen, onClose, onCreateGroup,search, handleSearchChange, searchedUsers }) => {
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState('');
  const [groupMembers, setGroupMembers] = useState([]); // { _id, username }

  const handleAddMember = (user) => {
    if (!groupMembers.find((m) => m._id === user._id)) {
      setGroupMembers([...groupMembers, { _id: user._id, username: user.username }]);
    }
  };

  const handleRemoveMember = (userId) => {
    setGroupMembers(groupMembers.filter((m) => m._id !== userId));
  };

  const handleCreateGroup = () => {
    if (!groupName || !groupImage || groupMembers.length === 0) {
      toaster.create({
        title: "Please provide group name, image, and at least one member",
        type: 'error',
    });
      return;
    }

    onCreateGroup({
      groupName,
      groupImage,
      groupMembers
    });

    // Reset after creation
    setGroupName('');
    setGroupImage('');
    setGroupMembers([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button className="absolute top-2 right-2" onClick={onClose}>
          <AiOutlineClose size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-4">Create Group</h2>

        {/* Group Name */}
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />

        {/* Profile Picture Selection */}
        <h3 className="text-lg font-medium mb-2">Select Group Picture</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {groupImages.map((avatar) => (
            <img
              key={avatar.name}
              src={avatar.src}
              alt={avatar.name}
              className={`w-16 h-16 rounded-full cursor-pointer border-2 ${
                groupImage === avatar.src ? 'border-black' : 'border-transparent hover:border-blue-500'
              }`}
              onClick={() => setGroupImage(avatar.src)}
            />
          ))}
        </div>

        {/* Search Users */}
        <SearchBar
          placeholder="Search users..."
          value={search}
          onChange={(value) => {
            handleSearchChange(value)
        }}
        />

        {/* Search Results */}
        <div className="max-h-40 overflow-y-auto mt-2 space-y-2">
          {searchedUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => handleAddMember(user)}
              className="cursor-pointer"
            >
              <UserCard id={user._id} name={user.username} image={user.profile_pic} />
            </div>
          ))}
        </div>

        {/* Added Members */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Group Members</h3>
          <div className="flex flex-wrap gap-2">
            {groupMembers.map((member) => (
              <div key={member._id} className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {member.username}
                <button
                  className="ml-2 text-red-500"
                  onClick={() => handleRemoveMember(member._id)}
                >
                  <AiOutlineClose />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreateGroup}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default GroupCreationModal;
