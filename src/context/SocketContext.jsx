// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();


export const SocketProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const socket = io('http://localhost:5000'); // backend URL'in

  // Toast notification function (dummy, replace with your own implementation)
  const showNotificationToast = useCallback((notification) => {
    // You can replace this with a real toast library (e.g. react-toastify)
    alert(`Yeni bildirim: ${notification.type} - ${notification.fromUsername}`);
  }, []);

  useEffect(() => {
    socket.on("new-notification", (notification) => {
      console.log("Yeni bildirim:", notification);
      setNotifications(prev => [notification, ...prev]);
      showNotificationToast(notification);
    });
    return () => {
      socket.off("new-notification");
    };
  }, [showNotificationToast, socket]);

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
export default SocketContext;