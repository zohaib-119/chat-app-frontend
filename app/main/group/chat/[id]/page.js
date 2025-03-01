'use client'
import Loading from '@/components/Loading';
import { useState, useEffect, useRef } from 'react';
import { toaster } from '@/components/ui/toaster';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/authContext';
import { useMessage } from '@/context/messageContext';
import { useRouter } from 'next/navigation';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function GroupChatWindow() {
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const chatContainerRef = useRef(null);
    const { user, setUnseenGroupChats, token } = useAuth();
    const { messages, setMessages, setCommunicationId } = useMessage();
    const { id } = useParams();
    const router = useRouter();

    function formatCustomTime(isoString) {
        const date = new Date(isoString);

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format

        return `${hours}:${minutes} ${ampm}`;
    }

    useEffect(() => {
        setCommunicationId(id)
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/group-message/get-messages/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setGroup(response.data.group);
                    setMessages(response.data.chatMessages);
                    setLoading(false);
                    try {
                        const response2 = await axios.put(`${baseURL}/api/group-message/seen/${id}`, {}, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                        });
                        if (response2.data.success) {
                            setUnseenGroupChats(prev => prev.filter(chat => chat !== id));
                        } else {
                            console.error(response.data.message)
                        }
                    } catch (error) {
                        console.error(error)
                    }
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
        }
        fetchMessages();

        return () => {
            setCommunicationId(null);
        }
    }, [id]);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Function to send message
    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(`${baseURL}/api/group-message/add-message`, { groupId: id, text: newMessage }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.data.success) {
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
        setNewMessage('');
    };


    if (loading || !group)
        return <Loading text='Loading Messages...' />

    return (
        <main className="flex-1 flex flex-col bg-white shadow-md rounded-lg">
            <div className="p-4 border-b flex items-center gap-3">
                <img src={group.profile_pic} className="h-10 w-10 rounded-full" alt="Group" />
                <span className="font-semibold text-lg">{group.name}</span>
            </div>

            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                    <div key={message._id} className={`flex flex-col ${message.sender._id === user._id ? "items-end" : "items-start"}`}>
                        <div
                            className={`p-3 rounded-lg text-white max-w-xs ${message.sender._id === user._id ? "bg-blue-500" : "bg-gray-400"}`}
                        >
                            {message.sender._id !== user._id && (
                                <span className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer" onClick={() => router.push(`/main/chat/${message.sender._id}`)}>
                                    {message.sender.username}
                                </span>
                            )}
                            <p className="">{message.text}</p>
                            <span className="text-xs text-gray-200 flex justify-end">{formatCustomTime(message.createdAt)}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t flex items-center gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
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
