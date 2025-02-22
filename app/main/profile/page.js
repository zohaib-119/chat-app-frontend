"use client";
import { useState } from "react";
import avatars from "@/public/avatars"; 
import { MdCancel } from "react-icons/md";
import { MdDone } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const mockUser = {
  _id: "3",
  name: "Muhammad Zohaib",
  email: "zohaib@example.com",
  profile_pic: "/avatars/man.png", // Default avatar
};

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [newAvatar, setNewAvatar] = useState(user.profile_pic);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Save profile changes
  const saveChanges = () => {
    setUser({ ...user, name: newName, profile_pic: newAvatar });
    setIsEditing(false);
  };

  return (
    <main className="flex flex-col items-center bg-gray-100 shadow-md rounded-lg p-6 w-full mx-auto">
      {/* Profile Section */}
      <div className="flex flex-col items-center w-full">
        {/* Avatar (Editable Only in Edit Mode) */}
        <div
          className={`relative ${isEditing ? "cursor-pointer" : ""}`}
          onClick={() => isEditing && setShowAvatarModal(true)}
        >
          <img
            src={newAvatar}
            alt="Profile"
            className="w-28 h-28 rounded-full border-2 border-gray-300"
          />
          {isEditing && (
            <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              <FaEdit/>
            </span>
          )}
        </div>

        {/* Profile Info (Editable Only in Edit Mode) */}
        <div className="mt-4 w-full text-center">
          {isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border p-2 rounded-md w-60 text-center"
            />
          ) : (
            <h2 className="text-lg font-semibold">{user.name}</h2>
          )}
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-3 w-full justify-center">
        {isEditing ? (
          <>
            <button
              onClick={saveChanges}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              <MdDone/>
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              <MdCancel/>
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            <span className="flex items-center justify-center gap-2"><FaEdit/> Edit</span>
          </button>
        )}
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Select an Avatar</h3>
            <div className="grid grid-cols-3 gap-3">
              {avatars.map((avatar) => (
                <img
                  key={avatar.name}
                  src={avatar.src}
                  alt={avatar.name}
                  className="w-16 h-16 rounded-full cursor-pointer border-2 border-transparent hover:border-blue-500"
                  onClick={() => {
                    setNewAvatar(avatar.src);
                    setShowAvatarModal(false);
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setShowAvatarModal(false)}
              className="mt-4 bg-gray-400 text-white px-4 py-2 rounded-md w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
