import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";
import axios from "axios";
import { FaUserFriends, FaBookmark, FaCog, FaHashtag } from "react-icons/fa";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const [trending, setTrending] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Trending hashtag'ler
    setTrending([
      { tag: "#react", posts: 1243 },
      { tag: "#javascript", posts: 892 },
      { tag: "#webdev", posts: 756 },
      { tag: "#design", posts: 543 },
      { tag: "#startup", posts: 432 }
    ]);

    // Önerilen kullanıcılar
    setSuggestions([
      { id: 4, username: "ayse", fullName: "Ayşe Yıldız", avatar: "https://i.pravatar.cc/150?img=12" },
      { id: 5, username: "can", fullName: "Can Öztürk", avatar: "https://i.pravatar.cc/150?img=15" },
      { id: 6, username: "deniz", fullName: "Deniz Arslan", avatar: "https://i.pravatar.cc/150?img=20" }
    ]);
  }, []);

  const followUser = async (userId) => {
    try {
      await axios.post(`/api/users/${userId}/follow`);
      // UI güncelle
    } catch (err) {
      console.error("Takip hatası:", err);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="user-profile">
          <img src={user?.avatar} alt={user?.username} className="profile-avatar" />
          <div>
            <Link to={`/profile/${user?.username}`} className="profile-username">
              {user?.username}
            </Link>
            <p className="profile-name">{user?.fullName}</p>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h3><FaUserFriends /> Takip Önerileri</h3>
        {suggestions.map(suggestion => (
          <div key={suggestion.id} className="suggestion-item">
            <img src={suggestion.avatar} alt={suggestion.username} />
            <div>
              <Link to={`/profile/${suggestion.username}`}>{suggestion.username}</Link>
              <p>{suggestion.fullName}</p>
            </div>
            <button onClick={() => followUser(suggestion.id)} className="follow-btn">
              Takip Et
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-section">
        <h3><FaHashtag /> Trend Olanlar</h3>
        {trending.map((trend, index) => (
          <div key={index} className="trend-item">
            <Link to={`/explore?tag=${trend.tag}`} className="trend-tag">
              {trend.tag}
            </Link>
            <span className="trend-count">{trend.posts} gönderi</span>
          </div>
        ))}
      </div>

      <div className="sidebar-section">
        <h3><FaBookmark /> Kaydedilenler</h3>
        <Link to="/saved" className="sidebar-link">
          Tüm kaydedilenleri gör
        </Link>
      </div>

      <div className="sidebar-section">
        <h3><FaCog /> Ayarlar</h3>
        <Link to="/settings" className="sidebar-link">
          Hesap Ayarları
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;