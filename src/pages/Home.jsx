import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LikeButton from '../components/LikeButton';
import CommentButton from '../components/CommentButton';
import CommentSection from '../components/CommentSection';
import { FaImage, FaSmile, FaMapMarkerAlt } from 'react-icons/fa';

const Home = () => {
  // ========== STATE'LER ==========
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPostContent, setNewPostContent] = useState('');

  // ========== FONKSİYONLAR ==========
  
  // Gönderileri getir
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data);
      setError(null);
    } catch (err) {
      console.error('Gönderiler yüklenemedi:', err);
      setError('Gönderiler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Yeni gönderi oluştur
  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !user) {
      alert('Lütfen bir şeyler yazın!');
      return;
    }

    try {
      const newPost = {
        id: posts.length + 1,
        userId: user.id,
        username: user.username,
        userAvatar: user.avatar,
        content: newPostContent,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString()
      };

      // Mock: Frontend'de state'e ekle
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      
      alert('Gönderiniz paylaşıldı!');
    } catch (err) {
      console.error('Gönderi paylaşılamadı:', err);
      alert('Gönderi paylaşılamadı!');
    }
  };

  // Tarihi formatla
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    });
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchPosts();
  }, []);

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* Yeni Gönderi Oluşturma */}
        {user && (
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <div className="flex items-start space-x-3">
              <img 
                src={user.avatar} 
                alt={user.username}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Neler oluyor?"
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <FaImage className="text-green-500" />
                      <span className="text-sm">Fotoğraf</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <FaSmile className="text-yellow-500" />
                      <span className="text-sm">Emoji</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span className="text-sm">Konum</span>
                    </button>
                  </div>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim()}
                    className={`px-6 py-2 rounded-full font-medium ${
                      newPostContent.trim()
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Paylaş
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gönderi Listesi */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Gönderiler yükleniyor...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-700 font-medium">{error}</p>
              <button
                onClick={fetchPosts}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Tekrar Dene
              </button>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-800">Henüz gönderi yok</h3>
              <p className="text-gray-600 mt-2">İnsanları takip ederek gönderilerini görebilirsin.</p>
              <a 
                href="/explore" 
                className="inline-block mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Keşfet
              </a>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow overflow-hidden">
                {/* Gönderi Başlığı */}
                <div className="p-4 border-b">
                  <div className="flex items-center">
                    <img 
                      src={post.userAvatar} 
                      alt={post.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3">
                      <h4 className="font-bold text-gray-800">{post.username}</h4>
                      <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Gönderi İçeriği */}
                <div className="p-4">
                  <p className="text-gray-800">{post.content}</p>
                </div>

                {/* Gönderi İstatistikleri */}
                <div className="px-4 py-2 border-t border-b text-sm text-gray-600 flex space-x-4">
                  <span>{post.likes?.length || 0} beğeni</span>
                  <span>{post.comments?.length || 0} yorum</span>
                </div>

                {/* Gönderi Aksiyonları */}
                <div className="p-4 flex space-x-4">
                  <LikeButton 
                    postId={post.id}
                    initialLikes={post.likes || []}
                    initialLikeCount={post.likes?.length || 0}
                  />
                  
                  <CommentButton 
                    postId={post.id}
                    commentCount={post.comments?.length || 0}
                  />
                  
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                    <span>🔄</span>
                    <span>Paylaş</span>
                  </button>
                </div>

                {/* Yorumlar Bölümü (isteğe bağlı) */}
                {/* <CommentSection postId={post.id} /> */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;