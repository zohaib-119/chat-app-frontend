"use client";
import { useState } from "react";
import avatars from "@/public/avatars";
import { toaster } from "@/components/ui/toaster";
import { useAuth } from "@/context/authContext";
import { useThemeContext } from "@/context/themeContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { 
  HiOutlineArrowLeft,
  HiOutlineCamera,
  HiOutlineEnvelope,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlinePaintBrush
} from "react-icons/hi2";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const { user, setUser, setIsAuthenticated, setIsReady, token } = useAuth();
  const { isDark, toggleTheme } = useThemeContext();
  const [newAvatar, setNewAvatar] = useState(user.profile_pic);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const router = useRouter();

  const saveChanges = async () => {
    try {
      const response = await axios.put(`${baseURL}/api/auth/update-profile`, { profile_pic: newAvatar }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUser({ ...user, profile_pic: newAvatar });
        toaster.create({
          title: 'Profile photo updated successfully!',
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
    deleteCookie('token');
    setIsReady(false);
    setIsAuthenticated(false);
    setUser(null);
    router.replace('/');
  }

  return (
    <main className="flex-1 flex flex-col bg-primary overflow-y-auto">
      {/* Header */}
      <div className="bg-surface border-b border-theme px-4 py-3 flex items-center gap-3">
        <button 
          onClick={() => router.push('/main')}
          className="p-2 -ml-2 rounded-xl hover:bg-surface-hover transition-colors text-secondary"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-primary">Profile Settings</h1>
      </div>

      <div className="flex-1 p-4 md:p-6 max-w-2xl mx-auto w-full">
        {/* Profile Card */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={newAvatar || '/avatars/user.png'}
                alt="Profile"
                className="w-28 h-28 rounded-2xl object-cover ring-4 ring-[rgb(var(--primary)/0.1)]"
              />
              <button 
                onClick={() => setShowAvatarModal(true)}
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white shadow-lg hover:opacity-90 transition-opacity"
              >
                <HiOutlineCamera className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-primary mb-1">{user.username}</h2>
              <p className="text-secondary flex items-center justify-center sm:justify-start gap-2">
                <HiOutlineEnvelope className="w-4 h-4" />
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {/* Account Info */}
          <div className="card">
            <h3 className="text-sm font-semibold text-tertiary uppercase tracking-wider mb-4">
              Account Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary">
                <div className="w-10 h-10 rounded-xl bg-[rgb(var(--primary)/0.1)] flex items-center justify-center">
                  <HiOutlineUser className="w-5 h-5 text-[rgb(var(--primary))]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-tertiary">Username</p>
                  <p className="font-medium text-primary">{user.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary">
                <div className="w-10 h-10 rounded-xl bg-[rgb(var(--primary)/0.1)] flex items-center justify-center">
                  <HiOutlineEnvelope className="w-5 h-5 text-[rgb(var(--primary))]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-tertiary">Email</p>
                  <p className="font-medium text-primary">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="card">
            <h3 className="text-sm font-semibold text-tertiary uppercase tracking-wider mb-4">
              Appearance
            </h3>
            <div className="space-y-3">
              <button 
                onClick={toggleTheme}
                className="w-full flex items-center gap-4 p-3 rounded-xl bg-secondary hover:bg-surface-hover transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[rgb(var(--primary)/0.1)] flex items-center justify-center">
                  <HiOutlinePaintBrush className="w-5 h-5 text-[rgb(var(--primary))]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-primary">Theme</p>
                  <p className="text-sm text-tertiary">{isDark ? 'Dark mode' : 'Light mode'}</p>
                </div>
                <div className={`
                  w-12 h-7 rounded-full p-1 transition-colors
                  ${isDark ? 'bg-[rgb(var(--primary))]' : 'bg-[rgb(var(--border))]'}
                `}>
                  <div className={`
                    w-5 h-5 rounded-full bg-white shadow-md transition-transform
                    ${isDark ? 'translate-x-5' : 'translate-x-0'}
                  `}>
                    {isDark ? (
                      <HiOutlineMoon className="w-5 h-5 text-[rgb(var(--primary))] p-0.5" />
                    ) : (
                      <HiOutlineSun className="w-5 h-5 text-yellow-500 p-0.5" />
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="w-full card hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <HiOutlineArrowRightOnRectangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-red-500">Sign Out</p>
                <p className="text-sm text-tertiary">Log out of your account</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 animate-fade-in"
            onClick={() => {
              setNewAvatar(user.profile_pic);
              setShowAvatarModal(false);
            }}
          />
          
          {/* Modal */}
          <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-md animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-theme">
              <h3 className="text-lg font-semibold text-primary">Choose Avatar</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={saveChanges}
                  className="p-2 rounded-xl bg-[rgb(var(--online))] text-white hover:opacity-90 transition-opacity"
                >
                  <HiOutlineCheck className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                    setNewAvatar(user.profile_pic);
                    setShowAvatarModal(false);
                  }}
                  className="p-2 rounded-xl bg-[rgb(var(--unread))] text-white hover:opacity-90 transition-opacity"
                >
                  <HiOutlineXMark className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Avatar Grid */}
            <div className="p-4">
              <div className="grid grid-cols-4 gap-3">
                {avatars.map((avatar) => (
                  <button
                    key={avatar.name}
                    onClick={() => setNewAvatar(avatar.src)}
                    className={`
                      relative aspect-square rounded-xl overflow-hidden transition-all duration-200
                      ${newAvatar === avatar.src 
                        ? 'ring-4 ring-[rgb(var(--primary))] scale-95' 
                        : 'hover:scale-95 ring-2 ring-transparent hover:ring-[rgb(var(--border))]'
                      }
                    `}
                  >
                    <img
                      src={avatar.src}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                    {newAvatar === avatar.src && (
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
          </div>
        </div>
      )}
    </main>
  );
}
