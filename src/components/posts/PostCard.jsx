import React, { useState } from 'react';
import './PostCard.css';

function PostCard({ post }) {
	const [liked, setLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(post.likes || 0);

	const handleLike = () => {
		if (liked) {
			setLikeCount(prev => prev - 1);
		} else {
			setLikeCount(prev => prev + 1);
		}
		setLiked(!liked);
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diff = now - date;
    
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);
    
		if (minutes < 60) return `${minutes}d`;
		if (hours < 24) return `${hours}sa`;
		if (days < 7) return `${days}g`;
		return date.toLocaleDateString('tr-TR');
	};

	return (
		<div className="post-card">
			<div className="post-header">
				<img 
					src={`https://i.pravatar.cc/48?img=${post.id}`}
					alt={post.author}
					className="post-avatar"
				/>
				<div className="post-user-info">
					<div className="post-author">{post.author}</div>
					<div className="post-meta">
						@{post.username || post.author.toLowerCase()} · {formatDate(post.date)}
					</div>
				</div>
			</div>
      
			<div className="post-content">
				{post.content}
			</div>
      
			{post.image && (
				<div className="post-media">
					<img src={post.image} alt="Gönderi" className="post-image" />
				</div>
			)}
      
			<div className="post-actions">
				<button 
					className={`action-btn comment-btn ${liked ? 'liked' : ''}`}
					onClick={handleLike}
				>
					<span className="action-icon">❤️</span>
					<span className="action-count">{likeCount}</span>
				</button>
        
				<button className="action-btn comment-btn">
					<span className="action-icon">💬</span>
					<span className="action-count">{post.comments || 0}</span>
				</button>
        
				<button className="action-btn retweet-btn">
					<span className="action-icon">🔄</span>
					<span className="action-count">{post.retweets || 0}</span>
				</button>
        
				<button className="action-btn share-btn">
					<span className="action-icon">📤</span>
				</button>
			</div>
		</div>
	);
}

export default PostCard;
