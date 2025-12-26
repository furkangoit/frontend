// src/components/Navigation.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const { unreadCount } = useSocket();

  const navItems = [
    { name: 'Ana Sayfa', path: '/', icon: '🏠' },
    { name: 'Keşfet', path: '/explore', icon: '🔍' },
    { name: 'Bildirimler', path: '/notifications', icon: '🔔', badge: unreadCount },
    { name: 'Mesajlar', path: '/messages', icon: '💬' },
    { name: 'Profil', path: '/profile', icon: '👤' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-logo">
        <h2>SocialApp</h2>
      </div>
      
      <ul className="nav-menu">
        {navItems.map((item, index) => (
          <li key={index} className="nav-item">
            <Link 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
              {item.badge > 0 && (
                <span className="notification-badge">{item.badge}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <div className="online-status">
        <span className="status-dot"></span>
        <span>Çevrimiçi</span>
      </div>
    </nav>
  );
};

export default Navigation;