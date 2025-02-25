"use client";

import { usePathname } from "next/navigation";
import SearchBar from "@/components/Searchbar";
import UserCard from "@/components/UserCard";
import { useState } from "react";

const mockUsers = [
    { _id: "3", name: "Muhammad Zohaib", profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg" },
    { _id: "4", name: "John Doe", profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg" },
];

export default function Chats() {
    const [search, setSearch] = useState('');
    const pathname = usePathname();

    // Extract ID from URL
    const selectedId = pathname.split("/").pop();
    const isIdPresent = Boolean(selectedId); 

    // Filter users based on search input (case insensitive)
    const filteredUsers = mockUsers.filter((user) =>
        user.name.toLowerCase().includes(search.trim().toLowerCase())
    );

    return (
        <aside className="w-full bg-white border-r shadow-md p-4 overflow-y-auto h-screen sm:w-80">
            <SearchBar
                value={search}
                onChange={(value) => setSearch(value)}
            />
            <div className="space-y-2 mt-5">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <UserCard
                            key={user._id}
                            name={user.name}
                            image={user.profile_pic}
                            className={isIdPresent && user._id === selectedId ? "bg-gray-200" : "bg-gray-50"}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No users found</p>
                )}
            </div>
        </aside>
    );
}
