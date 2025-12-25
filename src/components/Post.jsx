// src/pages/Posts.jsx veya src/components/Posts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    console.log('🔄 Gönderiler yükleniyor...');
    setLoading(true);
    setError('');

    try {
      // 1. Önce backend bağlantısını test et
      const healthCheck = await axios.get('http://localhost:5000/api/health');
      console.log('✅ Backend sağlıklı:', healthCheck.data);

      // 2. Gönderileri getir
      const response = await axios.get('http://localhost:5000/api/posts', {
        timeout: 5000
      });
      
      console.log('📦 Gönderiler geldi:', response.data);
      setPosts(response.data.data);
      
    } catch (err) {
      console.error('❌ Hata:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('⏱️ Backend yanıt vermedi (timeout)');
      } else if (err.response) {
        setError(`Backend hatası: ${err.response.status} - ${err.response.data?.message}`);
      } else if (err.request) {
        setError('Backend\'e bağlanılamadı. Port 5000 çalışıyor mu?');
      } else {
        setError(`Beklenmeyen hata: ${err.message}`);
      }
      
      // Hata durumunda test verileri göster
      setPosts([
        { id: 1, title: 'TEST - Backend Yanıt Vermedi', content: 'Lütfen backend terminalini kontrol edin', author: 'Sistem', date: '2024-01-01', likes: 0, comments: 0 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const testBackend = () => {
    window.open('http://localhost:5000/api/posts', '_blank');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔄</div>
        <h3>Gönderiler yükleniyor...</h3>
        <p>Backend: http://localhost:5000</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#333' }}>📝 SocialApp Gönderiler</h1>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <h3>🔧 Kontrol Paneli</h3>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={fetchPosts}
            style={{
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Gönderileri Yenile
          </button>
          
          <button 
            onClick={testBackend}
            style={{
              padding: '10px 20px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔗 Backend'i Test Et
          </button>
        </div>
        
        {error && (
          <div style={{ 
            padding: '15px', 
            background: '#f8d7da',
            color: '#721c24',
            borderRadius: '5px',
            border: '1px solid #f5c6cb'
          }}>
            <strong>⚠️ Hata:</strong> {error}
          </div>
        )}
        
        <div style={{ marginTop: '20px', fontSize: '14px' }}>
          <p><strong>Backend URL:</strong> http://localhost:5000</p>
          <p><strong>API Endpoint:</strong> /api/posts</p>
          <p><strong>Gönderi Sayısı:</strong> {posts.length}</p>
          <p><strong>Backend Durumu:</strong> <span style={{color: 'green'}}>✅ Çalışıyor</span></p>
        </div>
      </div>

      <h2>📋 Gönderiler ({posts.length})</h2>
      
      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>📭 Henüz gönderi yok</p>
        </div>
      ) : (
        <div>
          {posts.map(post => (
            <div 
              key={post.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '10px',
                padding: '20px',
                marginBottom: '20px',
                background: 'white',
                boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ marginTop: '0', color: '#2c3e50' }}>{post.title}</h3>
              <p style={{ color: '#555', lineHeight: '1.6' }}>{post.content}</p>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '20px',
                paddingTop: '15px',
                borderTop: '1px solid #eee'
              }}>
                <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                  <span style={{ marginRight: '15px' }}>👤 {post.author}</span>
                  <span style={{ marginRight: '15px' }}>📅 {post.date}</span>
                </div>
                
                <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                  <span style={{ marginRight: '15px' }}>❤️ {post.likes} beğeni</span>
                  <span>💬 {post.comments} yorum</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Posts;