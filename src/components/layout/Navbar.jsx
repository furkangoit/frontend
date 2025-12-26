import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🐦</span>
          <span className="logo-text">SocialApp</span>
        </Link>
        
        <div className="navbar-search">
          <input 
            type="text" 
            placeholder="Ara..."
            className="search-input"
          />
        </div>
        
        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Ana Sayfa</span>
          </Link>
          <Link to="/explore" className="nav-link">
            <span className="nav-icon">🔍</span>
            <span className="nav-text">Keşfet</span>
          </Link>
          <Link to="/notifications" className="nav-link">
            <span className="nav-icon">🔔</span>
            <span className="nav-text">Bildirimler</span>
          </Link>
          <Link to="/messages" className="nav-link">
            <span className="nav-icon">✉️</span>
            <span className="nav-text">Mesajlar</span>
          </Link>
          <Link to="/profile" className="nav-link">
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profil</span>
          </Link>
        </div>
        
        <button className="tweet-button">Post</button>
      </div>
    </nav>
  );
}

export default Navbar;