// Post.jsx - GÜNCELLENMİŞ VERSİYON

import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import './Post.css';

const Post = (props) => {
  const {
    user = { name: 'Kullanıcı', avatar: 'https://via.placeholder.com/40' },
    content = '',
    likes = 0,
    comments = 0,
    time = 'Şimdi',
    image = null,
    shares = 0,
    ...rest
  } = props;
  console.log('Post props:', { user, content, likes, comments, time, image, shares });

  // Socket notification
  const { sendNotification } = useSocket();

  // State'ler
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [postComments, setPostComments] = useState([]);
  const [shareCount, setShareCount] = useState(shares);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareOptions = [
    { platform: 'Facebook', icon: '📘', className: 'facebook' },
    { platform: 'Twitter', icon: '🐦', className: 'twitter' },
    { platform: 'WhatsApp', icon: '💚', className: 'whatsapp' },
    { platform: 'LinkedIn', icon: '💼', className: 'linkedin' },
    { platform: 'Instagram', icon: '📷', className: 'instagram' },
    { platform: 'Kopyala', icon: '📋', className: 'copy' },
  ];

  // Beğeni işlemi
  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
      // Bildirim gönder
      sendNotification && sendNotification({
        type: 'like',
        fromUserId: 'current-user-id', // Gerçek uygulamada localStorage'dan alınmalı
        fromUsername: 'Siz',
        targetUserId: user?.id || 'post-owner-id',
        postId: props.id,
        message: 'gönderinizi beğendi'
      });
    }
    setIsLiked(!isLiked);
  };

  // Kaydetme işlemi
  const handleSave = () => {
    setIsSaved(!isSaved);
    alert(isSaved ? 'Gönderi kaydedilmekten çıkarıldı' : 'Gönderi kaydedildi!');
  };

  // Yorum gösterme/gizleme
  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // Yorum ekleme
  const handleAddComment = () => {
    if (commentInput.trim() === '') {
      alert('Lütfen yorumunuzu yazın!');
      return;
    }

    const newComment = {
      id: Date.now(),
      user: { name: 'Siz', avatar: 'https://ui-avatars.com/api/?name=Siz&background=667eea&color=fff' },
      content: commentInput,
      time: 'Şimdi'
    };

    setPostComments([...postComments, newComment]);
    setCommentInput('');
    alert('Yorumunuz eklendi!');
  };

  // Paylaşma işlemi (modal ile)
  const handleShare = () => {
    setShareCount(prev => prev + 1);
    setShowShareModal(true);
  };

  // Link kopyalama işlemi
  const handleCopyLink = () => {
    const postLink = `${window.location.origin}/post/${props.id || Date.now()}`;
    navigator.clipboard.writeText(postLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error('Kopyalama hatası:', err);
        alert('Link kopyalanamadı!');
      });
  };

  // Default değerler için kontrol
  const safeUser = user || { name: 'Kullanıcı', avatar: 'https://via.placeholder.com/40' };
  const safeContent = content || 'Gönderi içeriği bulunamadı';

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <img 
          src={safeUser.avatar} 
          alt={safeUser.name} 
          className="user-avatar"
        />
        <div className="user-info">
          <h4>{safeUser.name}</h4>
          <span className="post-time">{time}</span>
        </div>
      </div>

      {/* Post Content */}
      <div className="post-content">
        <p>{safeContent}</p>
      </div>

      {/* Post Image (if exists) */}
      {image && (
        <div className="post-media">
          <img src={image} alt="Gönderi" />
        </div>
      )}

      {/* Post Stats */}
      <div className="post-stats">
        <span>{likeCount.toLocaleString()} beğeni</span>
        <span>{comments + postComments.length} yorum</span>
        <span>{shareCount} paylaşım</span>
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
          onClick={handleShare}
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

      {/* Yorumlar Bölümü */}
      {showComments && (
        <div className="comments-section">
          {/* Yorum Ekleme */}
          <div className="add-comment">
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
            >
              Gönder
            </button>
          </div>

          {/* Yorum Listesi */}
          {postComments.length > 0 ? (
            <div className="comments-list">
              {postComments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <img 
                    src={comment.user.avatar} 
                    alt={comment.user.name}
                    className="comment-avatar"
                  />
                  <div className="comment-content">
                    <div className="comment-header">
                      <strong>{comment.user.name}</strong>
                      <span className="comment-time">{comment.time}</span>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-comments">Henüz yorum yok. İlk yorumu siz yapın!</p>
          )}
        </div>
      )}

      {/* Paylaşım Modalı */}
      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={e => e.stopPropagation()}>
            <div className="share-modal-header">
              <h3>Gönderiyi Paylaş</h3>
              <button onClick={() => setShowShareModal(false)}>✕</button>
            </div>
            <div className="modal-post-preview">
              <div className="modal-post-author">
                <img src={safeUser.avatar} alt={safeUser.name} />
                <h4>{safeUser.name}</h4>
              </div>
              <p className="modal-post-content">
                {safeContent.length > 100 ? safeContent.substring(0, 100) + '...' : safeContent}
              </p>
            </div>
            <div className="share-options">
              {shareOptions.map(option => (
                <button
                  key={option.platform}
                  className={`share-option ${option.className}`}
                  onClick={() => {
                    alert(`${option.platform} ile paylaşıldı! (Simülasyon)`);
                    setShowShareModal(false);
                  }}
                >
                  <span className="share-icon">{option.icon}</span>
                  <span>{option.platform}</span>
                </button>
              ))}
            </div>
            <div className="copy-link-section">
              <h4>Veya linki kopyala:</h4>
              <div className="link-container">
                <input
                  type="text"
                  value={`${window.location.origin}/post/${props.id || Date.now()}`}
                  readOnly
                  className="link-input"
                />
                <button onClick={handleCopyLink} className="copy-link-btn">
                  {copied ? '✓ Kopyalandı' : 'Kopyala'}
                </button>
              </div>
              {copied && (
                <div className="copy-success">
                  ✓ Link panoya kopyalandı!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;