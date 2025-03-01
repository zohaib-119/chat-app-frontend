'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './authContext';
import { toaster } from '@/components/ui/toaster';
import axios from 'axios';
const MessageContext = createContext();

export function MessageProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const [communicationId, setCommunicationId] = useState(null); // refering to the user_id or group_id in chat
    const { socket, unseenChats, setUnseenChats, currentChats, fetchChats, setChatGroups, user, unseenGroupChats, setUnseenGroupChats } = useAuth();

    useEffect(() => {
        if (!socket) return;


        const handleNewMessage = async ({newMessage, senderName}) => {
            if (communicationId && newMessage.sender_id === communicationId) {
                setMessages(prevMessages => [...prevMessages, newMessage]);
                try {
                    axios.put(`http://localhost:5000/api/message/seen/${newMessage.sender_id}`, {}, { withCredentials: true });
                } catch (error) {
                    console.error(error)
                }
            } else {
                toaster.create({
                    title: `${senderName}`,
                    description: `${newMessage.text}`,
                });
                if (currentChats.includes(newMessage.sender_id)) {
                    if (!unseenChats.includes(newMessage.sender_id)) {
                        setUnseenChats(prev => [...prev, newMessage.sender_id]);
                    }
                } else {
                    fetchChats();
                }
            }
        };


        const handleNewGroupMessage = async ({ newMessage, groupId, groupName }) => {
            if (communicationId && groupId === communicationId) {
                setMessages(prevMessages => [...prevMessages, newMessage]);
                try {
                    await axios.put(`http://localhost:5000/api/group-message/seen/${groupId}`, {}, { withCredentials: true });
                } catch (error) {
                    console.error(error)
                }
            } else {
                toaster.create({
                    title: `${groupName}`,
                    description: `${newMessage.sender.username}: ${newMessage.text}`,
                });
                if (!unseenGroupChats.includes(groupId)) {
                    setUnseenGroupChats(prev => [...prev, groupId]);
                }
            }
        };

        const handleNewGroupCreated = ({ group, creator_id }) => {
            if (user._id !== creator_id) {
                toaster.create({
                    title: "Added to New Group",
                    description: `You have been added to ${group.name}`,
                });
            }
            setChatGroups(prev => [...prev, group]);
        }

        // handleGroupCreationState

        // Attach listener
        socket.on('newMessage', handleNewMessage);
        socket.on('newGroupMessage', handleNewGroupMessage);
        socket.on('newGroupCreated', handleNewGroupCreated);

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('newGroupMessage', handleNewGroupMessage);
            socket.off('newGroupCreated', handleNewGroupCreated);
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