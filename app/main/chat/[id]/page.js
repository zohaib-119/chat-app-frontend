'use client';
import Loading from '@/components/Loading';
import { useState, useEffect, useRef } from 'react';
import { toaster } from '@/components/ui/toaster';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/authContext';
import { useMessage } from '@/context/messageContext';
import { useRouter } from 'next/navigation';

export default function ChatWindow() {
  const [chatPartner, setChatPartner] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const chatContainerRef = useRef(null);
  const { setUnseenChats, user } = useAuth();
  const {messages, setMessages, setCommunicationId} = useMessage();
  const router = useRouter();

  const { id } = useParams();

  if(user._id === id) {
    router.replace('/main')
  }

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  function formatCustomTime(isoString) {
    const date = new Date(isoString);

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format

    return `${hours}:${minutes} ${ampm}`;
  }


  useEffect(() => {
    const fetchMessages = async () => {
      setCommunicationId(id)
      try {
        const response = await axios.get(`http://localhost:5000/api/message/messages/${id}`, { withCredentials: true });

        if (response.data.success) {
          setChatPartner(response.data.chatUser);
          setMessages(response.data.chatMessages);
          setLoading(false);
          try {
            const response2 = await axios.put(`http://localhost:5000/api/message/seen/${id}`, {}, { withCredentials: true });
            if (response2.data.success) {
              setUnseenChats(prev => prev.filter(chat => chat !== id));
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
          router.replace('/main');
        }
      } catch (error) {
        toaster.create({
          title: error.response?.data?.message || "Something went wrong",
          type: 'error',
        });
        router.replace('/main');
      }
    }

    fetchMessages();

    return () => {
      setCommunicationId(null);
    }
  }, [id]);

  // Scroll to bottom on component mount and when chats update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/message/add-message`, { receiver_id: id, text: newMessage }, { withCredentials: true });

      if (response.data.success) {
        setMessages([...messages, response.data.chatMessage]);
      } else {
        toaster.create({
          title: "Failed to send message",
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


  if (loading || !chatPartner)
    return <Loading text='Loading Messages...' />

  return (
    <main className="flex-1 flex flex-col bg-white shadow-md rounded-lg">
      <div className="p-4 border-b flex items-center gap-3">
        <img src={chatPartner.profile_pic || '/avatars/user.png'} className="h-10 w-10 rounded-full" alt="User" />
        <span className="font-semibold text-lg">{chatPartner.username}</span>
      </div>

      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div key={message._id} className={`flex ${message.sender_id === chatPartner._id ? 'justify-start' : 'justify-end'}`}>
            <div className={`p-3 rounded-lg text-white ${message.sender_id === chatPartner._id ? 'bg-gray-400' : 'bg-blue-500'}`}>
              <p className="text-sm">{message.text}</p>
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
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Send
        </button>
      </div>
    </main>
  );
}
