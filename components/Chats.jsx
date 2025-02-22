"use client";

import { usePathname } from "next/navigation";
import SearchBar from "@/components/Searchbar";
import ProfileCard from "@/components/ProfileCard";
import CreateGroup from "./CreateGroup";

const mockGroups = [
    { _id: "1", name: "Developers Hub", profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg" },
    { _id: "2", name: "Gaming Squad", profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg" },
];

const mockUsers = [
    { _id: "3", name: "Muhammad Zohaib", profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg" },
    { _id: "4", name: "John Doe", profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg" },
];

export default function Chats() {
    const pathname = usePathname();

    // Extract ID from URL (e.g., "/chat/1" → "1", "/group/2" → "2")
    const selectedId = pathname.split("/").pop();
    const isIdPresent = !isNaN(Number(selectedId)); // Check if it's a valid ID

    return (
        <aside className="w-full bg-white border-r shadow-md p-4 overflow-y-auto h-screen sm:w-80">
            <SearchBar />

            <div className="flex justify-between items-center text-blue-600 text-lg font-semibold mb-4 mt-4">
                <h2>Groups</h2>
                <CreateGroup/>
            </div>
            <div className="space-y-2">
                {mockGroups.map((group) => (
                    <ProfileCard
                        key={group._id}
                        name={group.name}
                        image={group.profile_pic}
                        className={isIdPresent && group._id === selectedId ? "bg-gray-200" : "bg-gray-50"}
                    />
                ))}
            </div>

            <h2 className="text-lg font-semibold text-blue-600 mt-6 mb-4">Users</h2>
            <div className="space-y-2">
                {mockUsers.map((user) => (
                    <ProfileCard
                        key={user._id}
                        name={user.name}
                        image={user.profile_pic}
                        className={isIdPresent && user._id === selectedId ? "bg-gray-200" : "bg-gray-50"}
                    />
                ))}
            </div>
        </aside>
    );
}
