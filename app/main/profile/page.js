"use client";
import { useState } from "react";
import avatars from "@/public/avatars";
import { MdCancel } from "react-icons/md";
import { toaster } from "@/components/ui/toaster";
import { MdDone } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "@/context/authContext";
import axios from "axios";
import { useRouter } from "next/navigation";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const { user, setUser, setIsAuthenticated, setIsReady } = useAuth();
  const [newAvatar, setNewAvatar] = useState(user.profile_pic);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const router = useRouter();

  const saveChanges = async () => {
    try {
      const response = await axios.put(`${baseURL}/api/auth/update-profile`, { profile_pic: newAvatar }, { withCredentials: true });

      if (response.data.success) {
        setUser({ ...user, profile_pic: newAvatar });
        toaster.create({
          title: 'Profile photo updated successfully',
          type: 'success',
        });
      } else {
        toaster.create({
          title: response.data.message,
          type: 'error',
        });
      }
      setShowAvatarModal(false);
    } catch (error) {
      toaster.create({
        title: error.response?.data?.message || "Something went wrong",
        type: 'error',
      });
      setShowAvatarModal(false);
    }
  }

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/auth/logout`, {}, { withCredentials: true });

      if (response.data.success) {
        setIsReady(false);
        setIsAuthenticated(false);
        setUser(null);
        router.replace('/');
      } else {
        toaster.create({
          title: response.data.message,
          type: 'error',
        });
      }
    } catch (error) {
      toaster.create({
        title: error.response?.data?.message || "Something went wrong",
        type: 'error',
      });
    }
  }

  return (
    <main className="flex flex-col items-center bg-gray-100 shadow-md rounded-lg p-6 w-full mx-auto">
      {/* Profile Section */}
      <div className="flex flex-col items-center w-full">
        {/* Avatar (Editable) */}
        <div className="relative cursor-pointer" onClick={() => setShowAvatarModal(true)}>
          <img
            src={newAvatar || '/avatars/user.png'}
            alt="Profile"
            className="w-28 h-28 rounded-full border-2 border-gray-300"
          />
          <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            <FaEdit />
          </span>
        </div>

        {/* Username (Not Editable) */}
        <div className="mt-4 w-full text-center">
          <h2 className="text-lg font-semibold">{user.username}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-4 w-full flex justify-center">
        <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={handleLogout}>Logout</button>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select an Avatar</h3>
              <div className="flex gap-5 justify-end">
                <button onClick={saveChanges} className="bg-green-500 text-white px-2 py-1 rounded-md">
                  <MdDone />
                </button>
                <button onClick={() => {
                  setNewAvatar(user.profile_pic);
                  setShowAvatarModal(false)

                }}
                  className="bg-red-500 text-white px-2 py-1 rounded-md">
                  <MdCancel />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {avatars.map((avatar) => (
                <img
                  key={avatar.name}
                  src={avatar.src}
                  alt={avatar.name}
                  className={`w-16 h-16 rounded-full cursor-pointer border-2 border-transparent hover:border-blue-500 ${newAvatar === avatar.src ? 'border-black' : ''}`}
                  onClick={() => setNewAvatar(avatar.src)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
