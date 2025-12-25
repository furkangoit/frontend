import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LikeButton = ({ postId, initialLikes = [], initialLikeCount = 0 }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(initialLikes.includes(user?.id || 0));
  const [likeCount, setLikeCount] = useState(initialLikeCount || initialLikes.length);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!user || !user.id) {
      alert('Beğenmek için giriş yapmalısınız!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/like`,
        { userId: user.id },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
      
      console.log('Beğeni durumu:', response.data);
    } catch (error) {
      console.error('Beğeni hatası:', error);
      alert('Beğeni işlemi başarısız! API hatası.');
    } finally {
      setLoading(false);
    }
  };

  // Eğer kullanıcı yoksa, butonu pasif göster
  if (!user) {
    return (
      <button
        disabled
        className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
      >
        <FaRegHeart className="text-lg" />
        <span className="font-medium">
          {likeCount > 0 ? likeCount : 'Beğen'}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
        liked 
          ? 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
      } ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
      title={liked ? 'Beğenmekten vazgeç' : 'Beğen'}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
          <span>...</span>
        </div>
      ) : (
        <>
          {liked ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-500 text-lg" />
          )}
          <span className="font-medium">
            {likeCount > 0 ? likeCount : 'Beğen'}
          </span>
        </>
      )}
    </button>
  );
};

export default LikeButton;