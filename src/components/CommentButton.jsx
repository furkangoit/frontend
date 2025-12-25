import React, { useState } from 'react';
import { FaComment, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CommentButton = ({ postId, commentCount = 0 }) => {
  const { user } = useAuth();
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComment = async () => {
    if (!commentText.trim() || !user) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
        {
          userId: user.id,
          text: commentText
        }
      );

      console.log('Yorum eklendi:', response.data);
      alert('Yorumunuz eklendi!');
      setCommentText('');
      setShowCommentBox(false);
      
      // Sayfayı yenile (veya state güncelle)
      window.location.reload();
    } catch (error) {
      console.error('Yorum hatası:', error);
      alert('Yorum eklenemedi!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowCommentBox(!showCommentBox)}
        className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 transition-all duration-200"
      >
        <FaComment className="text-lg" />
        <span className="font-medium">
          {commentCount > 0 ? commentCount : 'Yorum'}
        </span>
      </button>

      {showCommentBox && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
          <div className="flex items-start space-x-2 mb-3">
            <img 
              src={user?.avatar} 
              alt={user?.username}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Yorumunuzu yazın..."
                className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows="3"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setShowCommentBox(false)}
              className="px-3 py-1 text-gray-600 hover:text-gray-800 mr-2"
            >
              İptal
            </button>
            <button
              onClick={handleComment}
              disabled={!commentText.trim() || loading}
              className={`flex items-center space-x-1 px-4 py-2 rounded-full ${
                commentText.trim() && !loading
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Gönder</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentButton;