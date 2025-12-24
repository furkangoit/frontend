import React, { useState } from "react";
import axios from "axios";
import { 
  FaHeart, FaRegHeart, FaComment, FaShare, FaBookmark, 
  FaRegBookmark, FaEllipsisH 
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

const Post = ({ post, currentUser, onUpdate }) => {
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser?.id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      await axios.post(`/api/posts/${post.id}/like`);
      if (isLiked) {
        setLikesCount(prev => prev - 1);
      } else {
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
      
      // Parent component'i güncelle
      const updatedPost = {
        ...post,
        likes: isLiked 
          ? post.likes.filter(id => id !== currentUser?.id)
          : [...post.likes, currentUser?.id]
      };
      onUpdate(updatedPost);
    } catch (err) {
      console.error("Beğeni hatası:", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(`/api/posts/${post.id}/comments`, {
        text: commentText
      });
      
      setComments([...comments, response.data.comment]);
      setCommentText("");
      
      // Parent component'i güncelle
      const updatedPost = {
        ...post,
        comments: [...post.comments, response.data.comment]
      };
      onUpdate(updatedPost);
    } catch (err) {
      console.error("Yorum hatası:", err);
    }
  };

  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: tr 
    });
  };

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-user">
          <img src={post.userAvatar} alt={post.username} className="post-avatar" />
          <div>
            <h4 className="post-username">{post.username}</h4>
            <span className="post-time">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        <button className="post-options">
          <FaEllipsisH />
        </button>
      </div>

      {/* Post Content */}
      <div className="post-content">
        <p>{post.content}</p>
        {post.image && (
          <img src={post.image} alt="Post" className="post-image" />
        )}
      </div>

      {/* Post Stats */}
      <div className="post-stats">
        <span>{likesCount} beğeni</span>
        <span>{comments.length} yorum</span>
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <button 
          className={`action-btn ${isLiked ? "liked" : ""}`}
          onClick={handleLike}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          <span>Beğen</span>
        </button>
        
        <button 
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <FaComment />
          <span>Yorum Yap</span>
        </button>
        
        <button className="action-btn">
          <FaShare />
          <span>Paylaş</span>
        </button>
        
        <button 
          className="action-btn bookmark"
          onClick={() => setIsBookmarked(!isBookmarked)}
        >
          {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <img 
                  src={`https://i.pravatar.cc/150?img=${comment.userId}`} 
                  alt={comment.username}
                  className="comment-avatar"
                />
                <div className="comment-content">
                  <div className="comment-header">
                    <strong>{comment.username}</strong>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                  <p>{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add Comment */}
          <form onSubmit={handleComment} className="add-comment">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Yorum ekle..."
            />
            <button type="submit">Gönder</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;