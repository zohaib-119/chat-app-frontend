'use client';
import { useState, useEffect, useRef } from 'react';

const mockUser = {
  _id: '3',
  name: 'Muhammad Zohaib',
  profile_pic: 'https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg',
};

const mockChats = [
  { _id: '1', text: 'Hey, how are you?', sender_id: '3', receiver_id: '4', created_at: '10:30 AM' },
  { _id: '2', text: "I'm good! What about you?", sender_id: '4', receiver_id: '3', created_at: '10:31 AM' },
  { _id: '3', text: 'All good, just working on a project.', sender_id: '3', receiver_id: '4', created_at: '10:32 AM' },
];

export default function ChatWindow() {
  const [chats, setChats] = useState(mockChats);
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom on component mount and when chats update
  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  // Function to send message
  const sendMessage = () => {
    if (!message.trim()) return; // Prevent empty messages

    const newChat = {
      _id: Date.now().toString(),
      text: message,
      sender_id: mockUser._id,
      receiver_id: "4",
      created_at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChats([...chats, newChat]);
    setMessage(""); // Clear input field
  };

  return (
    <main className="flex-1 flex flex-col bg-white shadow-md rounded-lg">
      <div className="p-4 border-b flex items-center gap-3">
        <img src={mockUser.profile_pic} className="h-10 w-10 rounded-full" alt="User" />
        <span className="font-semibold text-lg">{mockUser.name}</span>
      </div>

      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {chats.map((chat) => (
          <div key={chat._id} className={`flex ${chat.sender_id === mockUser._id ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg text-white ${chat.sender_id === mockUser._id ? 'bg-blue-500' : 'bg-gray-400'}`}>
              <p className="text-sm">{chat.text}</p>
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
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Send
        </button>
      </div>
    </main>
  );
}
