
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { io } from "socket.io-client";
import "./App.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Messages from "./pages/Messages";

// Socket context
export const SocketContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Initialize socket
  useEffect(() => {
    if (user) {
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);

      // Socket events
      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
        newSocket.emit("user-login", user.id);
      });

      newSocket.on("new-message", (data) => {
        console.log("New message received:", data);
        setNotifications(prev => [...prev, {
          type: "message",
          from: data.message.senderId,
          text: data.message.text,
          timestamp: new Date()
        }]);
      });

      newSocket.on("user-status-changed", (data) => {
        console.log("User status changed:", data);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  // Check if user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <div className="app">
          {user && <Navbar user={user} logout={logout} notifications={notifications} />}
          
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login login={login} />} />
            <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
            <Route path="/messages" element={user ? <Messages user={user} /> : <Navigate to="/login" />} />
            <Route path="/messages/:conversationId" element={user ? <Messages user={user} /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </SocketContext.Provider>
  );
}

// Navbar Component
function Navbar({ user, logout, notifications }) {
  const unreadCount = notifications.length;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">📱 SocialApp</Link>
        </div>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <span className="nav-icon">🏠</span> Ana Sayfa
          </Link>
          
          <Link to="/messages" className="nav-link">
            <span className="nav-icon">💬</span> Mesajlar
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </Link>
        </div>

        <div className="navbar-user">
          <img src={user.avatar} alt={user.username} className="user-avatar" />
          <span className="username">@{user.username}</span>
          <button onClick={logout} className="logout-btn">Çıkış</button>
        </div>
      </div>
    </nav>
  );
}

export default App;