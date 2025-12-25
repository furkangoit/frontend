import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


import Login from './pages/Login';
import Posts from './pages/Posts'; // veya ./components/Posts
import Chat from './components/Chat';
import Feed from './pages/Feed'; // veya ./components/Feed
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{
          background: '#2c3e50',
          padding: '15px 30px',
          color: 'white',
          display: 'flex',
          gap: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
            🏠 SocialApp
          </Link>
          <Link to="/posts" style={{ color: 'white', textDecoration: 'none' }}>
            📝 Gönderiler
          </Link>
          <Link to="/chat" style={{ color: 'white', textDecoration: 'none' }}>
            💬 Chat
          </Link>
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
            🔐 Giriş
          </Link>
        </nav>
        
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;