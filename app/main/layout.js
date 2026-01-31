'use client';

import { useState, useRef, useEffect } from 'react';
import Chats from '@/components/Chats';
import { 
  HiOutlineBars3, 
  HiOutlineXMark, 
  HiOutlineUserGroup,
  HiOutlineChatBubbleLeftRight,
  HiOutlineSun,
  HiOutlineMoon
} from 'react-icons/hi2';
import { useAuth } from '@/context/authContext';
import { useThemeContext } from '@/context/themeContext';
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';
import GroupCreationModal from '@/components/GroupCreationModal';
import { toaster } from '@/components/ui/toaster';
import debounce from "lodash.debounce";
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const { isReady, user, token } = useAuth();
  const { isDark, toggleTheme } = useThemeContext();
  const sidebarRef = useRef(null);
  const router = useRouter();

  const searchUsers = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/user/search?username=${search}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setSearchedUsers(response.data.users);
      } else {
        toaster.create({
          title: response.data.message,
          type: 'error',
        });
        setSearchedUsers([]);
      }
    } catch (error) {
      toaster.create({
        title: error.response?.data?.message || "Something went wrong",
        type: 'error',
      });
      setSearchedUsers([]);
    }
  }

  const debouncedSearch = debounce(() => {
    if (search) {
      searchUsers();
    } else {
      setSearchedUsers([]);
    }
  }, 500);

  useEffect(() => {
    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [search])

  const closeSidebar = () => {
    setIsOpen(false);
  }

  const openSidebar = () => {
    setIsOpen(true);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isReady)
    return <Loading text='Loading, Please wait...' />

  return (
    <div className="h-screen flex flex-col bg-secondary">
      {/* Modern Navbar */}
      <nav className="bg-surface border-b border-theme px-4 py-3 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button 
            className="sm:hidden p-2 rounded-xl hover:bg-surface-hover transition-colors text-secondary"
            onClick={isOpen ? closeSidebar : openSidebar}
          >
            {isOpen ? (
              <HiOutlineXMark className="w-6 h-6" />
            ) : (
              <HiOutlineBars3 className="w-6 h-6" />
            )}
          </button>
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary hidden sm:block">LinkUp</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Create Group Button */}
          <button 
            onClick={() => setGroupModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl gradient-primary text-white font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <HiOutlineUserGroup className="w-5 h-5" />
            <span className="hidden md:inline">New Group</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-surface-hover transition-colors text-secondary"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <HiOutlineSun className="w-5 h-5" />
            ) : (
              <HiOutlineMoon className="w-5 h-5" />
            )}
          </button>

          {/* Profile Avatar */}
          <button 
            onClick={() => router.push('/main/profile')}
            className="relative group"
          >
            <img
              src={user.profile_pic || '/avatars/user.png'}
              alt="Profile"
              className="w-10 h-10 rounded-xl object-cover border-2 border-theme group-hover:border-[rgb(var(--primary))] transition-colors"
            />
            <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Overlay (mobile) */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-10 sm:hidden animate-fade-in"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`
            bg-surface border-r border-theme w-80 h-full 
            fixed sm:relative z-20
            transition-transform duration-300 ease-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
            sm:translate-x-0
          `}
        >
          <Chats onChatSelect={closeSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>

      {/* Group Creation Modal */}
      <GroupCreationModal
        isOpen={isGroupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        onCreateGroup={async ({
          groupName,
          groupImage,
          groupMembers
        }) => {
          try {
            const response = await axios.post(`${baseURL}/api/group/create`, { 
              name: groupName, 
              profile_pic: groupImage, 
              members: groupMembers.map(grp => grp._id) 
            }, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (response.data.success) {
              toaster.create({
                title: "Group created successfully!",
                type: 'success',
              });
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
          setSearch('');
        }}
        search={search}
        handleSearchChange={(value) => setSearch(value)}
        searchedUsers={searchedUsers}
      />
    </div>
  );
}
