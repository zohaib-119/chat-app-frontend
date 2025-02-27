'use client';

import { useState, useRef, useEffect } from 'react';
import Chats from '@/components/Chats';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { useAuth } from '@/context/authContext';
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';
import GroupCreationModal from '@/components/GroupCreationModal';
import { toaster } from '@/components/ui/toaster';
import debounce from "lodash.debounce";
import axios from 'axios';

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const { isReady, user } = useAuth();
  const sidebarRef = useRef(null);
  const router = useRouter();

  const searchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/search?username=${search}`, { withCredentials: true });
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
  }, 1000);

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
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-500 text-white p-4 shadow-md flex justify-between items-center">
        <div className="font-semibold text-lg">Link Up</div>
        <div className='flex items-center gap-5 justify-center'>
          <button onClick={() => setGroupModalOpen(true)}>Create Group</button>

          <div>
            <img
              src={user.profile_pic || '/avatars/user.png'}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
              onClick={() => {
                router.push('/main/profile');
              }}
            />
          </div>
          {isOpen ? <div className="sm:hidden cursor-pointer" onClick={closeSidebar}>
            <AiOutlineClose size={24} />
          </div> : <div className="sm:hidden cursor-pointer" onClick={openSidebar}>
            <AiOutlineMenu size={24} />
          </div>}
        </div>

      </nav>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar (Always visible on large screens, Drawer on small screens) */}
        <div
          ref={sidebarRef}
          className={`bg-white shadow-lg w-80 h-full sm:relative fixed sm:flex transition-transform z-10 ${isOpen ? 'translate-x-0' : '-translate-x-full'
            } sm:translate-x-0`}
        >
          <Chats />
        </div>

        {children}
      </div>

      <GroupCreationModal
        isOpen={isGroupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        onCreateGroup={(groupData) => {
          console.log('Group Created:', groupData);
          // You can send groupData to your backend here
        }}
        search={search}
        handleSearchChange={(value) => setSearch(value)}
        searchedUsers={searchedUsers}
      />
    </div>
  );
}
