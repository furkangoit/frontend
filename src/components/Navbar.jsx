import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHome, FaCompass, FaPlusSquare, FaHeart, FaUser, FaBell } from "react-icons/fa";


const Navbar = ({ notifications = [] }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const unreadCount = notifications.length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>📱 SocialApp</h1>
        </div>

        <div className="navbar-search">
          <input type="text" placeholder="Ara..." className="search-input" />
        </div>

        <div className="navbar-icons">
          <Link to="/" className="nav-icon">
            <FaHome size={24} />
          </Link>
          <Link to="/explore" className="nav-icon">
            <FaCompass size={24} />
          </Link>
          <button className="nav-icon">
            <FaPlusSquare size={24} />
          </button>
          <button className="nav-icon">
            <FaHeart size={24} />
          </button>
          {/* Bildirim ikonu */}
          <div className="relative nav-icon">
            <button className="p-2 hover:bg-gray-100 rounded-full" style={{ background: 'none', border: 'none', position: 'relative' }}>
              <FaBell className="text-gray-600 text-xl" />
              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
          <Link to={`/profile/${user?.username}`} className="nav-icon">
            <img 
              src={user?.avatar || "https://i.pravatar.cc/150"} 
              alt={user?.username}
              className="user-avatar"
            />
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Çıkış
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;