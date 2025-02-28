'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './authContext';

const MessageContext = createContext();

export function MessageProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const [communicationId, setCommunicationId] = useState(null); // refering to the user_id or group_id in chat
    const { socket, unseenChats, setUnseenChats, currentChats } = useAuth();

    useEffect(() => {
        if(!socket) return;
        const handleNewMessage = (newMessage) => {
            if (communicationId && newMessage.sender_id === communicationId) {
                setMessages(prevMessages => [...prevMessages, newMessage]);
            } else {
                if (currentChats.includes(newMessage.sender_id) && !unseenChats.includes(newMessage.sender_id)) {
                    setUnseenChats(prev => [...prev, newMessage.sender_id]);
                } else {
                    toaster.create({
                        title: "A message from unknown user",
                        type: 'error',
                    });
                }
            }
        };

        // Attach listener
        socket.on('newMessage', handleNewMessage);

        const handleNewGroupMessage = ({ newMessage, groupId }) => {
            if (communicationId && groupId === communicationId) {
                setMessages(prevMessages => [...prevMessages, newMessage]);
            } else {

            }
        };

        // Attach listener
        socket.on('newGroupMessage', handleNewGroupMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('newGroupMessage', handleNewMessage);
        };
    }, [communicationId, currentChats, unseenChats, socket]);

    return (
        <MessageContext.Provider value={{ messages, setMessages, setCommunicationId }}>
            {children}
        </MessageContext.Provider>
    );
}

export function useMessage() {
    return useContext(MessageContext);
}