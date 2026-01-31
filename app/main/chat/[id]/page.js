'use client';
import Loading from '@/components/Loading';
import { useState, useEffect, useRef } from 'react';
import { toaster } from '@/components/ui/toaster';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/authContext';
import { useMessage } from '@/context/messageContext';
import { useRouter } from 'next/navigation';
import { 
  HiOutlinePaperAirplane, 
  HiOutlineArrowLeft,
  HiOutlineEllipsisVertical
} from 'react-icons/hi2';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function ChatWindow() {
  const [chatPartner, setChatPartner] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const { setUnseenChats, user, token, onlineUsers } = useAuth();
  const { messages, setMessages, setCommunicationId } = useMessage();
  const router = useRouter();

  const { id } = useParams();

  if (user._id === id) {
    router.replace('/main')
  }

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
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  function formatMessageDate(isoString) {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }

  function shouldShowDateSeparator(currentMsg, prevMsg) {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.createdAt).toDateString();
    const prevDate = new Date(prevMsg.createdAt).toDateString();
    return currentDate !== prevDate;
  }

  useEffect(() => {
    const fetchMessages = async () => {
      setCommunicationId(id)
      try {
        const response = await axios.get(`${baseURL}/api/message/messages/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setChatPartner(response.data.chatUser);
          setMessages(response.data.chatMessages);
          setLoading(false);
          try {
            const response2 = await axios.put(`${baseURL}/api/message/seen/${id}`, {}, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await axios.post(`${baseURL}/api/message/add-message`, { receiver_id: id, text: newMessage }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

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
    setIsSending(false);
    inputRef.current?.focus();
  };

  const isOnline = chatPartner && onlineUsers.includes(chatPartner._id);

  if (loading || !chatPartner)
    return <Loading text='Loading conversation...' />

  return (
    <main className="flex-1 flex flex-col bg-primary overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-surface border-b border-theme">
        {/* Back button (mobile) */}
        <button 
          onClick={() => router.push('/main')}
          className="sm:hidden p-2 -ml-2 rounded-xl hover:bg-surface-hover transition-colors text-secondary"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div className="relative">
          <img 
            src={chatPartner.profile_pic || '/avatars/user.png'} 
            className="w-11 h-11 rounded-xl object-cover" 
            alt={chatPartner.username} 
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[rgb(var(--online))] border-2 border-[rgb(var(--surface))] rounded-full" />
          )}
        </div>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-primary truncate">{chatPartner.username}</h2>
          <p className={`text-sm ${isOnline ? 'text-[rgb(var(--online))]' : 'text-tertiary'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>

        {/* Menu button */}
        {/* <button className="p-2 rounded-xl hover:bg-surface-hover transition-colors text-secondary">
          <HiOutlineEllipsisVertical className="w-5 h-5" />
        </button> */}
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        style={{ background: 'rgb(var(--bg-chat))' }}
      >
        {messages.map((message, index) => {
          const isSent = message.sender_id !== chatPartner._id;
          const showDate = shouldShowDateSeparator(message, messages[index - 1]);

          return (
            <div key={message._id}>
              {/* Date separator */}
              {showDate && (
                <div className="flex items-center justify-center my-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface text-tertiary border border-theme">
                    {formatMessageDate(message.createdAt)}
                  </span>
                </div>
              )}

              {/* Message bubble */}
              <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                <div className={`chat-bubble ${isSent ? 'chat-bubble-sent' : 'chat-bubble-received'}`}>
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${isSent ? 'justify-end' : 'justify-start'}`}>
                    <span className="message-time">{formatCustomTime(message.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-surface border-t border-theme">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="
              flex-1 px-4 py-3 rounded-xl
              bg-secondary border border-theme
              text-primary placeholder:text-tertiary
              focus:border-[rgb(var(--primary))] focus:ring-2 focus:ring-[rgb(var(--primary)/0.1)]
              outline-none transition-all duration-200
            "
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            disabled={!newMessage.trim() || isSending}
            className="
              p-3 rounded-xl gradient-primary text-white
              hover:opacity-90 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            "
          >
            <HiOutlinePaperAirplane className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}
