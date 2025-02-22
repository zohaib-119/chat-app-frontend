'use client'

import { useState, useEffect } from "react";
import {
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import ProfileCard from "@/components/ProfileCard";
import { MdGroupAdd } from "react-icons/md";

const CreateGroup = () => {
    const [groupName, setGroupName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);

    async function fetchUsers() {
        try {
            const response = await axios.get(`http://localhost:5000/api/users?limit=5&searchByName=${searchTerm}`);
            if (response.data && Array.isArray(response.data.users)) {
                setUsers(response.data.users);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
        }
    }

    useEffect(() => {
        if (searchTerm) {
            fetchUsers();
        } else {
            setUsers([]);
        }
    }, [searchTerm]);

    const toggleUserSelection = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
        );
    };

    const handleCreateGroup = () => {
        if (!groupName.trim()) {
            alert("Group name is required!");
            return;
        }

        console.log("Creating group with:", {
            name: groupName,
            members: selectedUsers,
        });

        // TODO: Implement API call to create the group
    };

    return (
        <PopoverRoot>
            <PopoverTrigger asChild>
                <div className="cursor-pointer text-xl hover:text-2xl">
                <MdGroupAdd />
                </div>
            </PopoverTrigger>
            <PopoverContent className="bg-white shadow-lg rounded-lg p-4 w-64">
                <PopoverArrow />
                <PopoverBody>
                    <h2 className="text-lg font-semibold text-blue-600">Create Group</h2>
                    <p className="text-sm text-gray-600 mb-2">Enter group name and select members.</p>
                    <input
                        type="text"
                        placeholder="Group name"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Search users"
                        className="w-full px-3 py-2 border rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <ProfileCard
                                    key={user.id}
                                    name={user.name}
                                    image={user.profile_pic}
                                    className={`cursor-pointer p-2 rounded-md ${selectedUsers.includes(user.id) ? "border-blue-500 border-2" : "border-gray-300 border"
                                        }`}
                                    onClick={() => toggleUserSelection(user.id)}
                                />
                            ))
                        ) : (
                            <div className='font-semibold text-black'>
                                No users found
                            </div>
                        )}
                    </div>
                    {selectedUsers.length > 0 && (
                        <p className="mt-2 text-sm font-semibold">Selected Users: {selectedUsers.length}</p>
                    )}
                    <div className="flex justify-end mt-4 gap-2">
                        <button className="px-3 py-2 text-gray-700 border rounded-md hover:bg-gray-100 transition">Cancel</button>
                        <button className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition" onClick={handleCreateGroup}>
                            Create
                        </button>
                    </div>
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    );
};

export default CreateGroup;
