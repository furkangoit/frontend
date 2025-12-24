import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { FaHome, FaCompass, FaPlusSquare, FaHeart, FaUser } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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