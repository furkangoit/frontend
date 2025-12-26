// src/context/SocketContext.jsx - GELİŞTİRİLMİŞ VERSİYON
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Socket.io bağlantısı kuruldu:', newSocket.id);
      setIsConnected(true);
      // Kullanıcıyı sunucuya kaydet
      newSocket.emit('register', {
        userId: user.id,
        username: user.username
      });
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket.io bağlantısı kesildi');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket bağlantı hatası:', error);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [token, user]);

  const sendMessage = (room, message) => {
    if (socket && isConnected) {
      socket.emit('send_message', {
        room,
        message,
        userId: user.id,
        username: user.username,
        timestamp: new Date().toISOString()
      });
    }
  };

  const joinRoom = (room) => {
    if (socket && isConnected) {
      socket.emit('join_room', room);
    }
  };

  const sendNotification = (notification) => {
    if (socket && isConnected) {
      socket.emit('send_notification', {
        ...notification,
        fromUserId: user.id,
        fromUsername: user.username,
        timestamp: new Date().toISOString()
      });
    }
  };

  const value = {
    socket,
    isConnected,
    sendMessage,
    joinRoom,
    sendNotification
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);