import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle, FaClock } from 'react-icons/fa';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/posts/${postId}/comments`
      );
      setComments(response.data);
    } catch (error) {
      console.error('Yorumlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500 text-sm">Yorumlar yükleniyor...</div>;
  }

  if (comments.length === 0) {
    return <div className="text-gray-500 text-sm">Henüz yorum yok.</div>;
  }

  return (
    <div className="mt-4 space-y-3">
      <h4 className="font-medium text-gray-700">Yorumlar ({comments.length})</h4>
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <img 
            src={comment.userAvatar || `https://i.pravatar.cc/150?img=${comment.userId}`}
            alt={comment.username}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-800">{comment.username}</span>
              <span className="text-xs text-gray-500 flex items-center">
                <FaClock className="mr-1" />
                {new Date(comment.createdAt).toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <p className="text-gray-700 mt-1">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;