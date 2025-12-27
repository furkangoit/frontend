// Post.jsx - GÜNCELLENMİŞ VERSİYON


import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { postAPI } from '../services/api';
import './Post.css';


const Post = ({ post, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const { sendNotification } = useSocket();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || post.likes?.length || 0);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || '');

  // Check if user liked/saved the post
  useEffect(() => {
    if (user && post.likes) {
      setIsLiked(post.likes.includes(user.id));
    }
    if (user && post.saves) {
      setIsSaved(post.saves.includes(user.id));
    }
  }, [user, post]);

  const handleLike = async () => {
    try {
      const response = await postAPI.likePost(post._id || post.id);
      
      if (response.success) {
        setIsLiked(!isLiked);
        setLikeCount(response.data.likeCount);
        
        // Send notification if liking
        if (!isLiked && post.user?._id !== user?.id) {
          sendNotification({
            type: 'like',
            targetUserId: post.user?._id || post.userId,
            postId: post._id || post.id,
            message: 'gönderinizi beğendi'
          });
        }
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await postAPI.savePost(post._id || post.id);
      
      if (response.success) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const loadComments = async () => {
    if (!showComments || comments.length > 0) return;
    
    try {
      setLoading(true);
      const response = await postAPI.getComments(post._id || post.id);
      
      if (response.success) {
        setComments(response.data);
      }
    } catch (error) {
      console.error('Comments error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;

    try {
      const response = await postAPI.addComment(post._id || post.id, {
        content: commentInput
      });

      if (response.success) {
        const newComment = response.data;
        setComments([newComment, ...comments]);
        setCommentInput('');
        
        // Send notification if commenting on someone else's post
        if (post.user?._id !== user?.id) {
          sendNotification({
            type: 'comment',
            targetUserId: post.user?._id || post.userId,
            postId: post._id || post.id,
            message: 'gönderinize yorum yaptı'
          });
        }
      }
    } catch (error) {
      console.error('Add comment error:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bu gönderiyi silmek istediğinize emin misiniz?')) return;

    try {
      const response = await postAPI.deletePost(post._id || post.id);
      
      if (response.success && onDelete) {
        onDelete(post._id || post.id);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await postAPI.updatePost(post._id || post.id, {
        content: editContent
      });

      if (response.success) {
        setIsEditing(false);
        if (onUpdate) {
          onUpdate(response.data);
        }
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      loadComments();
    }
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Şimdi';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <img 
          src={post.user?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'} 
          alt={post.user?.fullName || post.user?.username} 
          className="user-avatar"
        />
        <div className="user-info">
          <div className="user-info-top">
            <h4>{post.user?.fullName || post.user?.username || 'Kullanıcı'}</h4>
            <span className="post-time">
              {formatTime(post.createdAt || post.time)}
              {post.edited && ' · Düzenlendi'}
            </span>
          </div>
          <p className="username">@{post.user?.username || 'kullanici'}</p>
        </div>
        
        {user?.id === post.user?._id && (
          <div className="post-options">
            <button 
              className="options-btn"
              onClick={() => setShowOptions(!showOptions)}
            >
              ⋮
            </button>
            
            {showOptions && (
              <div className="options-menu">
                <button onClick={() => setIsEditing(true)}>
                  ✏️ Düzenle
                </button>
                <button onClick={handleDelete} className="delete-btn">
                  🗑️ Sil
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="post-content">
        {isEditing ? (
          <div className="edit-post">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows="3"
              maxLength="1000"
            />
            <div className="edit-actions">
              <button onClick={handleUpdate} className="save-btn">
                Kaydet
              </button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">
                İptal
              </button>
            </div>
          </div>
        ) : (
          <p>{post.content}</p>
        )}
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="post-media">
          <img src={post.image} alt="Gönderi" />
        </div>
      )}

      {/* Post Stats */}
      <div className="post-stats">
        <span>{likeCount.toLocaleString()} beğeni</span>
        <span>{post.commentCount || comments.length} yorum</span>
        <span>{post.shareCount || 0} paylaşım</span>
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <button 
          onClick={handleLike} 
          className={`action-btn ${isLiked ? 'liked' : ''}`}
        >
          {isLiked ? '❤️ Beğendin' : '🤍 Beğen'}
        </button>
        
        <button 
          onClick={toggleComments}
          className="action-btn"
        >
          💬 Yorum Yap
        </button>
        
        <button 
          onClick={() => postAPI.sharePost(post._id || post.id)}
          className="action-btn"
        >
          🔄 Paylaş
        </button>
        
        <button 
          onClick={handleSave} 
          className={`action-btn ${isSaved ? 'saved' : ''}`}
        >
          {isSaved ? '🔖 Kaydedildi' : '📌 Kaydet'}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          {/* Add Comment */}
          <div className="add-comment">
            <img 
              src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'} 
              alt="Profil" 
              className="comment-user-avatar"
            />
            <input
              type="text"
              placeholder="Yorumunuzu yazın..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              className="comment-input"
            />
            <button 
              onClick={handleAddComment}
              className="comment-button"
              disabled={!commentInput.trim()}
            >
              Gönder
            </button>
          </div>

          {/* Comments List */}
          <div className="comments-list">
            {loading ? (
              <div className="loading-comments">
                <div className="spinner"></div>
              </div>
            ) : comments.length > 0 ? (
              comments.map(comment => (
                <CommentItem 
                  key={comment._id || comment.id} 
                  comment={comment} 
                  currentUser={user}
                />
              ))
            ) : (
              <p className="no-comments">Henüz yorum yok. İlk yorumu siz yapın!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Comment Item Component
const CommentItem = ({ comment, currentUser }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || comment.likes?.length || 0);
  const [showReplies, setShowReplies] = useState(false);

  const handleLikeComment = async () => {
    try {
      const response = await postAPI.likeComment(comment._id || comment.id);
      
      if (response.success) {
        setIsLiked(!isLiked);
        setLikeCount(response.data.likeCount);
      }
    } catch (error) {
      console.error('Like comment error:', error);
    }
  };

  return (
    <div className="comment-item">
      <img 
        src={comment.user?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'} 
        alt={comment.user?.fullName || comment.user?.username} 
        className="comment-avatar"
      />
      <div className="comment-content">
        <div className="comment-header">
          <strong>{comment.user?.fullName || comment.user?.username || 'Kullanıcı'}</strong>
          <span className="comment-time">
            {new Date(comment.createdAt || comment.time).toLocaleDateString('tr-TR')}
            {comment.edited && ' · Düzenlendi'}
          </span>
        </div>
        <p>{comment.content}</p>
        
        <div className="comment-actions">
          <button 
            onClick={handleLikeComment}
            className={`comment-like-btn ${isLiked ? 'liked' : ''}`}
          >
            {isLiked ? '❤️' : '🤍'} {likeCount}
          </button>
          <button className="comment-reply-btn">
            💬 Yanıtla
          </button>
        </div>
        
        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies">
            <button 
              onClick={() => setShowReplies(!showReplies)}
              className="show-replies-btn"
            >
              {showReplies ? '▼ Yanıtları gizle' : '▶ Yanıtları göster'} ({comment.replies.length})
            </button>
            
            {showReplies && (
              <div className="replies-list">
                {comment.replies.map(reply => (
                  <CommentItem 
                    key={reply._id || reply.id} 
                    comment={reply} 
                    currentUser={currentUser}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;