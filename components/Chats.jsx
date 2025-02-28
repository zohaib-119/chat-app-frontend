"use client";

import { useEffect } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";
import { Tabs } from "@chakra-ui/react"
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu"
import { useAuth } from "@/context/authContext";
import SearchBar from "@/components/Searchbar";
import UserCard from "@/components/UserCard";
import debounce from "lodash.debounce";

export default function Chats() {
    const [search, setSearch] = useState('');
    const [searchedUsers, setSearchedUsers] = useState([]);
    const pathname = usePathname();
    const { chatUsers, onlineUsers, unseenChats, chatGroups } = useAuth();
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

    // Extract ID from URL
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

    return (
        <Tabs.Root defaultValue="chats" variant="plain">
            <Tabs.List bg="bg.muted" rounded="l3" p="1" width="full" display='flex' justifyContent='space-between'>
                <Tabs.Trigger value="chats" px='2'>
                    <LuUser />
                    Chats
                </Tabs.Trigger>
                <Tabs.Trigger value="groups" px='2'>
                    <LuFolder />
                    Groups
                </Tabs.Trigger>
                <Tabs.Trigger value="explore" px='2'>
                    <LuSquareCheck />
                    Explore
                </Tabs.Trigger>
                <Tabs.Indicator rounded="l2" />
            </Tabs.List>
            <Tabs.Content value="chats">
                <aside className="w-full bg-white border-r p-2 overflow-y-auto h-screen sm:w-80">
                    <div className="space-y-2">
                    <h3 className="ml-2 text-xl font-bold text-blue-600">Chats</h3>
                        {chatUsers.length > 0 ? (
                            chatUsers.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => router.push(`/main/chat/${user._id}`)}
                                    className="cursor-pointer"
                                >
                                    <UserCard
                                        name={user.username}
                                        image={user.profile_pic}
                                        online={onlineUsers.includes(user._id)}
                                        unread={unseenChats.includes(user._id)}
                                        className={isIdPresent && user._id === selectedId ? "bg-gray-200" : "bg-gray-50"}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No Chats Available</p>
                        )}
                    </div>
                </aside>
            </Tabs.Content>
            <Tabs.Content value="groups">
            <aside className="w-full bg-white border-r  p-2 overflow-y-auto h-screen sm:w-80">
                    <div className="space-y-2">
                    <h3 className="ml-2 text-xl font-bold text-blue-600">Groups</h3>
                        {chatGroups.length > 0 ? (
                            chatGroups.map((group) => (
                                <div
                                    key={group._id}
                                    onClick={() => router.push(`/main/group/chat/${group._id}`)}
                                    className="cursor-pointer"
                                >
                                    <UserCard
                                        name={group.name}
                                        image={group.profile_pic}
                                        className={isIdPresent && group._id === selectedId ? "bg-gray-200" : "bg-gray-50"}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No Groups Available</p>
                        )}
                    </div>
                </aside>
            </Tabs.Content>
            <Tabs.Content value="explore">
                <aside className="w-full bg-white border-r  p-2 overflow-y-auto h-screen sm:w-80">
                <h3 className="ml-2 text-xl font-bold text-blue-600 mb-2">Explore</h3>
                    <SearchBar
                        value={search}
                        onChange={(value) => setSearch(value)}
                    />
                    <div className="space-y-2 mt-5">
                        {searchedUsers.length > 0 && (
                            searchedUsers.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => router.push(`/main/chat/${user._id}`)}
                                    className="cursor-pointer"
                                >
                                <UserCard
                                    name={user.username}
                                    image={user.profile_pic}
                                    online={onlineUsers.includes(user._id)}
                                    className={isIdPresent && user._id === selectedId ? "bg-gray-200" : "bg-gray-50"}
                                />
                                </div>
                            ))
                        )}
                    </div>
                </aside>
            </Tabs.Content>
        </Tabs.Root>
    );
}
