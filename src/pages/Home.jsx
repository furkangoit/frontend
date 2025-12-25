import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Gönderileri getir
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data.data);
      setError('');
    } catch (err) {
      console.error('Gönderiler yüklenemedi:', err);
      setError('Gönderiler yüklenemedi');
      // Test için fake data
      setPosts([
        {
          id: 1,
          title: 'Örnek Gönderi',
          content: 'Backend bağlantısı kurulamadı. Test verisi gösteriliyor.',
          author: 'Sistem',
          date: new Date().toISOString().split('T')[0],
          likes: 0,
          comments: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Yeni gönderi oluştur
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/posts', {
        title: 'Yeni Gönderi',
        content: newPost,
        author: 'Kullanıcı'
      });

      console.log('Gönderi oluşturuldu:', response.data);
      
      // Input'u temizle
      setNewPost('');
      
      // Gönderileri yenile
      fetchPosts();
      
      alert('✅ Gönderi paylaşıldı!');
    } catch (err) {
      console.error('Gönderi oluşturulamadı:', err);
      alert('❌ Gönderi paylaşılamadı');
    } finally {
      setLoading(false);
    }
  };

  // Beğeni işlemi
  const handleLike = async (postId) => {
    try {
      // Backend'de like endpoint'i yoksa, frontend'de güncelle
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likes: post.likes + 1 }
            : post
        )
      );
    } catch (err) {
      console.error('Beğeni hatası:', err);
    }
  };

  return (
    <div className="feed-container">
      {/* SOL SİDEBAR */}
      <div className="sidebar">
        <div className="logo">🐦 SocialApp</div>
        <nav className="nav-menu">
          <a href="/" className="nav-item active">🏠 Ana Sayfa</a>
          <a href="/explore" className="nav-item">🔍 Keşfet</a>
          <a href="/notifications" className="nav-item">🔔 Bildirimler</a>
          <a href="/messages" className="nav-item">✉️ Mesajlar</a>
          <a href="/profile" className="nav-item">👤 Profil</a>
          <a href="/posts" className="nav-item">📝 Tüm Gönderiler</a>
          <a href="/chat" className="nav-item">💬 Chat</a>
        </nav>
        <button className="tweet-button">🐦 Post</button>
      </div>

      {/* ORTA KISIM - FEED */}
      <div className="main-content">
        {/* HEADER */}
        <div className="feed-header">
          <h2>Ana Sayfa</h2>
          <button onClick={fetchPosts} className="refresh-btn">🔄</button>
        </div>

        {/* YENİ POST OLUŞTURMA */}
        <div className="create-post">
          <div className="user-avatar">
            <img src="https://i.pravatar.cc/40" alt="Profil" />
          </div>
          <form onSubmit={handleSubmit} className="post-form">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Neler oluyor?"
              rows="3"
              disabled={loading}
            />
            <div className="post-actions">
              <div className="action-icons">
                <button type="button" className="icon-btn">📷</button>
                <button type="button" className="icon-btn">😊</button>
                <button type="button" className="icon-btn">📍</button>
                <button type="button" className="icon-btn">📊</button>
              </div>
              <button 
                type="submit" 
                disabled={!newPost.trim() || loading}
                className="post-submit-btn"
              >
                {loading ? 'Paylaşılıyor...' : 'Paylaş'}
              </button>
            </div>
          </form>
        </div>

        {/* GÖNDERİLER LİSTESİ */}
        <div className="posts-list">
          {loading && posts.length === 0 ? (
            <div className="loading">🔄 Gönderiler yükleniyor...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <img 
                    src={`https://i.pravatar.cc/40?img=${post.id}`} 
                    alt={post.author}
                    className="post-avatar"
                  />
                  <div className="post-user-info">
                    <span className="post-author">{post.author}</span>
                    <span className="post-date">@{post.author.toLowerCase().replace(' ', '')} · {post.date}</span>
                  </div>
                </div>
                
                <div className="post-content">
                  {post.content}
                </div>
                
                {post.image && (
                  <div className="post-image">
                    <img src={post.image} alt="Gönderi" />
                  </div>
                )}
                
                <div className="post-stats">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="stat-btn like-btn"
                  >
                    ❤️ {post.likes}
                  </button>
                  <button className="stat-btn">
                    💬 {post.comments}
                  </button>
                  <button className="stat-btn">
                    🔄
                  </button>
                  <button className="stat-btn">
                    📤
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SAĞ SİDEBAR */}
      <div className="right-sidebar">
        <div className="search-box">
          <input type="text" placeholder="Ara..." />
        </div>
        
        <div className="trends">
          <h3>Trendler</h3>
          <div className="trend-item">
            <span className="trend-category">Teknoloji · Trend</span>
            <span className="trend-name">#ReactJS</span>
            <span className="trend-count">15.2K post</span>
          </div>
          <div className="trend-item">
            <span className="trend-category">Programlama · Trend</span>
            <span className="trend-name">#JavaScript</span>
            <span className="trend-count">22.5K post</span>
          </div>
        </div>
        
        <div className="debug-info">
          <h4>🔧 Sistem Bilgisi</h4>
          <p><strong>Backend:</strong> localhost:5000</p>
          <p><strong>Gönderi Sayısı:</strong> {posts.length}</p>
          <p><strong>Durum:</strong> {loading ? 'Yükleniyor...' : 'Hazır'}</p>
          <button onClick={fetchPosts} className="small-btn">Gönderileri Yenile</button>
        </div>
      </div>
    </div>
  );
}

export default Feed;