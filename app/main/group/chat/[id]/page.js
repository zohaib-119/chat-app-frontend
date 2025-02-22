'use client'
import { useState, useEffect, useRef } from "react";
import Chats from "@/components/Chats";

const mockGroup = {
    _id: "1",
    name: "Developers Hub",
    profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg",
};

const mockUser = {
    _id: "3",
    name: "Muhammad Zohaib",
    profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg",
};

const mockChats = [
    {
        _id: "1",
        text: "Hey everyone! What's up?",
        sender: {
            _id: "3",
            name: "Muhammad Zohaib",
            profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg",
        },
        created_at: "10:30 AM",
    },
    {
        _id: "2",
        text: "All good! Just working on a project.",
        sender: {
            _id: "4",
            name: "Ali Khan",
            profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg",
        },
        created_at: "10:31 AM",
    },
    {
        _id: "3",
        text: "Nice! What's the project about?",
        sender: {
            _id: "5",
            name: "Sarah Ahmed",
            profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg",
        },
        created_at: "10:32 AM",
    },
];

export default function GroupChatWindow() {
    const [chats, setChats] = useState(mockChats);
    const [message, setMessage] = useState("");
    const chatContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chats]);

    const sendMessage = () => {
        if (!message.trim()) return;

        const newChat = {
            _id: Date.now().toString(),
            text: message,
            sender: { ...mockUser },
            created_at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setChats([...chats, newChat]);
        setMessage("");
    };

    return (
        <main className="flex-1 flex flex-col bg-white shadow-md rounded-lg">
            <div className="p-4 border-b flex items-center gap-3">
                <img src={mockGroup.profile_pic} className="h-10 w-10 rounded-full" alt="Group" />
                <span className="font-semibold text-lg">{mockGroup.name}</span>
            </div>

            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                {chats.map((chat) => (
                    <div key={chat._id} className={`flex flex-col ${chat.sender._id === mockUser._id ? "items-end" : "items-start"}`}>
                        <div
                            className={`p-3 rounded-lg text-white max-w-xs ${chat.sender._id === mockUser._id ? "bg-blue-500" : "bg-gray-400"}`}
                        >
                            {chat.sender._id !== mockUser._id && (
                                <span className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">
                                    {chat.sender.name}
                                </span>
                            )}
                            <p className="">{chat.text}</p>
                            <span className="text-xs text-gray-200">{chat.created_at}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t flex items-center gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-md outline-none"
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Send
                </button>
            </div>
        </main>
    );
}
