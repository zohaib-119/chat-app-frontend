"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";
import { useAuth } from "@/context/authContext";
import SearchBar from "@/components/Searchbar";
import UserCard from "@/components/UserCard";
import debounce from "lodash.debounce";
import { 
  HiOutlineChatBubbleLeft, 
  HiOutlineUserGroup, 
  HiOutlineMagnifyingGlass,
  HiOutlineInbox
} from "react-icons/hi2";

const baseURL = process.env.NEXT_PUBLIC_API_URL

const tabs = [
  { id: 'chats', label: 'Chats', icon: HiOutlineChatBubbleLeft },
  { id: 'groups', label: 'Groups', icon: HiOutlineUserGroup },
  { id: 'explore', label: 'Explore', icon: HiOutlineMagnifyingGlass },
];

export default function Chats({ onChatSelect }) {
    const [activeTab, setActiveTab] = useState('chats');
    const [search, setSearch] = useState('');
    const [searchedUsers, setSearchedUsers] = useState([]);
    const pathname = usePathname();
    const { chatUsers, onlineUsers, unseenChats, chatGroups, unseenGroupChats, token } = useAuth();
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

    const selectedId = pathname.split("/").pop();
    const isIdPresent = Boolean(selectedId);

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

    const handleNavigation = (path) => {
        router.push(path);
        if (onChatSelect) onChatSelect();
    };

    const EmptyState = ({ icon: Icon, title, description }) => (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[rgb(var(--primary)/0.1)] flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-[rgb(var(--primary))]" />
            </div>
            <h3 className="font-medium text-primary mb-1">{title}</h3>
            <p className="text-sm text-tertiary">{description}</p>
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            {/* Modern Tabs */}
            <div className="p-3 border-b border-theme">
                <div className="flex bg-secondary rounded-xl p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg
                                text-sm font-medium transition-all duration-200
                                ${activeTab === tab.id 
                                    ? 'bg-surface text-primary shadow-sm' 
                                    : 'text-tertiary hover:text-secondary'
                                }
                            `}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Chats Tab */}
                {activeTab === 'chats' && (
                    <div className="p-3 space-y-1">
                        <h3 className="px-2 py-2 text-xs font-semibold text-tertiary uppercase tracking-wider">
                            Direct Messages
                        </h3>
                        {chatUsers.length > 0 ? (
                            chatUsers.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => handleNavigation(`/main/chat/${user._id}`)}
                                    className="cursor-pointer"
                                >
                                    <UserCard
                                        name={user.username}
                                        image={user.profile_pic}
                                        online={onlineUsers.includes(user._id)}
                                        unread={unseenChats.includes(user._id)}
                                        isSelected={isIdPresent && user._id === selectedId}
                                    />
                                </div>
                            ))
                        ) : (
                            <EmptyState 
                                icon={HiOutlineInbox}
                                title="No conversations yet"
                                description="Start chatting by exploring users"
                            />
                        )}
                    </div>
                )}

                {/* Groups Tab */}
                {activeTab === 'groups' && (
                    <div className="p-3 space-y-1">
                        <h3 className="px-2 py-2 text-xs font-semibold text-tertiary uppercase tracking-wider">
                            Group Conversations
                        </h3>
                        {chatGroups.length > 0 ? (
                            chatGroups.map((group) => (
                                <div
                                    key={group._id}
                                    onClick={() => handleNavigation(`/main/group/chat/${group._id}`)}
                                    className="cursor-pointer"
                                >
                                    <UserCard
                                        name={group.name}
                                        image={group.profile_pic}
                                        unread={unseenGroupChats.includes(group._id)}
                                        isSelected={isIdPresent && group._id === selectedId}
                                        isGroup
                                    />
                                </div>
                            ))
                        ) : (
                            <EmptyState 
                                icon={HiOutlineUserGroup}
                                title="No groups yet"
                                description="Create a group to start collaborating"
                            />
                        )}
                    </div>
                )}

                {/* Explore Tab */}
                {activeTab === 'explore' && (
                    <div className="p-3 space-y-3">
                        <SearchBar
                            value={search}
                            onChange={(value) => setSearch(value)}
                            placeholder="Search users..."
                        />
                        <div className="space-y-1">
                            {searchedUsers.length > 0 ? (
                                searchedUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        onClick={() => handleNavigation(`/main/chat/${user._id}`)}
                                        className="cursor-pointer"
                                    >
                                        <UserCard
                                            name={user.username}
                                            image={user.profile_pic}
                                            online={onlineUsers.includes(user._id)}
                                            isSelected={isIdPresent && user._id === selectedId}
                                        />
                                    </div>
                                ))
                            ) : search ? (
                                <EmptyState 
                                    icon={HiOutlineMagnifyingGlass}
                                    title="No users found"
                                    description="Try a different search term"
                                />
                            ) : (
                                <EmptyState 
                                    icon={HiOutlineMagnifyingGlass}
                                    title="Find new people"
                                    description="Search for users to connect with"
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
