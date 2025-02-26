"use client";

import { usePathname } from "next/navigation";
import SearchBar from "@/components/Searchbar";
import UserCard from "@/components/UserCard";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { Tabs } from "@chakra-ui/react"
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu"

export default function Chats() {
    const [search, setSearch] = useState('');
    const pathname = usePathname();
    const { chatUsers, onlineUsers, unseenChats } = useAuth();

    // Extract ID from URL
    const selectedId = pathname.split("/").pop();
    const isIdPresent = Boolean(selectedId);

    

    return (
        <Tabs.Root defaultValue="all" variant="plain">
            <Tabs.List bg="bg.muted" rounded="l3" p="1" width="full" display='flex' justifyContent='space-between'>
                <Tabs.Trigger value="all" px='2'>
                    <LuUser />
                    All
                </Tabs.Trigger>
                <Tabs.Trigger value="unread" px='2'>
                    <LuFolder />
                    Unread
                </Tabs.Trigger>
                <Tabs.Trigger value="explore" px='2'>
                    <LuSquareCheck />
                    Explore
                </Tabs.Trigger>
                <Tabs.Indicator rounded="l2" />
            </Tabs.List>
            <Tabs.Content value="all">
                <aside className="w-full bg-white border-r  p-4 overflow-y-auto h-screen sm:w-80">
                    <div className="space-y-2 mt-5">
                        {chatUsers.length > 0 ? (
                            chatUsers.map((user) => (
                                <UserCard
                                    key={user._id}
                                    name={user.name}
                                    image={user.profile_pic}
                                    className={isIdPresent && user._id === selectedId ? "bg-gray-200" : "bg-gray-50"}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No Chats Available</p>
                        )}
                    </div>
                </aside>
            </Tabs.Content>
            <Tabs.Content value="unread">
                <aside className="w-full bg-white border-r  p-4 overflow-y-auto h-screen sm:w-80">
                    <div className="space-y-2 mt-5">
                        {chatUsers.length > 0 ? (
                            chatUsers.filter(user => unseenChats.contains(user._id)).map((user) => (
                                <UserCard
                                    key={user._id}
                                    name={user.name}
                                    image={user.profile_pic}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No Unread Messages</p>
                        )}
                    </div>
                </aside>
            </Tabs.Content>
            <Tabs.Content value="explore">
                <aside className="w-full bg-white border-r  p-4 overflow-y-auto h-screen sm:w-80">
                    <SearchBar
                        value={search}
                        onChange={(value) => setSearch(value)}
                    />
                </aside>
            </Tabs.Content>
        </Tabs.Root>
    );
}
