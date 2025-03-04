'use client'

import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { io } from "socket.io-client";
import { getCookie } from "cookies-next";

const AuthContext = createContext();

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChats, setCurrentChats] = useState([]);
  const [unseenChats, setUnseenChats] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [chatGroups, setChatGroups] = useState([]);
  const [unseenGroupChats, setUnseenGroupChats] = useState([]);

  const connectSocket = () => {
    if (!user || socket?.connected) return;

    const _socket = io(BASE_URL, {
      query: { userId: user._id },
    });

    _socket.connect();
    setSocket(_socket);

    // Listen for online users
    _socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/get-chats`,{
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setChatUsers(response.data.chatUsers);
        setCurrentChats(response.data.currentChats);
        setUnseenChats(response.data.unseenChats);
      } else {
        setChatUsers([]);
        setCurrentChats([]);
        setUnseenChats([]);
      }
    } catch (error) {
      // console.error("Error fetching chats:", error);
      setChatUsers([]);
      setCurrentChats([]);
      setUnseenChats([]);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/group/get-groups`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setChatGroups(response.data.groups);
        setUnseenGroupChats(response.data.unseenGroupChats);
      } else {
        setChatGroups([]);
        setUnseenGroupChats([]);
      }
    } catch (error) {
      // console.error("Error fetching chats:", error);
      setChatGroups([]);
      setUnseenGroupChats([]);
    }
  };

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const _token = getCookie('token') || '';
        const response = await axios.get(`${BASE_URL}/api/auth/check-auth`, {
          headers: {
            'Authorization': `Bearer ${_token}`,
          },
        });

        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          setToken(_token)
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    fetchAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchChats();
      fetchGroups();
      connectSocket();
      setIsReady(true);
    } else {
      disconnectSocket();
      setOnlineUsers([]);
      setChatUsers([]);
      setChatGroups([]);
      setCurrentChats([]);
      setUnseenChats([]);
    }
  }, [isAuthenticated, token]);

  return (
    <AuthContext.Provider value={{
      user, setUser, setIsAuthenticated,
      socket, onlineUsers,
      chatUsers, currentChats, unseenChats, setUnseenChats,
      isReady, chatGroups, setIsReady, fetchChats, setChatGroups,
      unseenGroupChats, setUnseenGroupChats, token, setToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
