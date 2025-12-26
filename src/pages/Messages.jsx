
// Messages.jsx - Private messaging (real-time)
import React, { useState, useEffect, useRef } from 'react';
import Navigation from '../components/Navigation';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import './Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // Online kullanıcıları dinle
    socket.on('online_users', (onlineUsers) => {
      setUsers(onlineUsers.filter(u => u.userId !== user.id));
    });

    // Private mesajları dinle
    socket.on('private_message', (message) => {
      setMessages(prev => [...prev, {
        ...message,
        isOwn: message.from === user.id
      }]);
    });

    // Message sent confirmation
    socket.on('message_sent', (message) => {
      // Opsiyonel: Mesaj gönderildi bildirimi
      // console.log('Mesaj gönderildi:', message);
    });

    return () => {
      socket.off('online_users');
      socket.off('private_message');
      socket.off('message_sent');
    };
  }, [socket, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendPrivateMessage = () => {
    if (!inputMessage.trim() || !selectedUser || !socket) return;

    socket.emit('private_message', {
      toUserId: selectedUser.userId,
      message: inputMessage
    });

    setMessages(prev => [...prev, {
      id: Date.now(),
      content: inputMessage,
      from: user.id,
      to: selectedUser.userId,
      isOwn: true,
      createdAt: new Date().toISOString(),
      fromUser: user
    }]);

    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrivateMessage();
    }
  };

  return (
    <div className="messages-container">
      <Navigation />
      
      <main className="messages-content">
        {/* Sol Panel - Kullanıcı Listesi */}
        <div className="users-sidebar">
          <div className="messages-header">
            <h1>Mesajlar</h1>
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '🟢 Çevrimiçi' : '🔴 Bağlantı yok'}
            </div>
          </div>

          <div className="users-list">
            <h3>Çevrimiçi Kullanıcılar ({users.length})</h3>
            {users.map(onlineUser => (
              <div
                key={onlineUser.userId}
                className={`user-item ${selectedUser?.userId === onlineUser.userId ? 'selected' : ''}`}
                onClick={() => setSelectedUser(onlineUser)}
              >
                <div className="user-avatar">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${onlineUser.username}&background=random&color=fff`} 
                    alt={onlineUser.username}
                  />
                  <span className="online-dot"></span>
                </div>
                <div className="user-info">
                  <h4>{onlineUser.username}</h4>
                  <span className="user-status">Çevrimiçi</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Panel - Mesajlaşma */}
        <div className="chat-area">
          {selectedUser ? (
            <>
              <div className="chat-header">
                <div className="chat-user">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${selectedUser.username}&background=667eea&color=fff`} 
                    alt={selectedUser.username}
                  />
                  <div>
                    <h3>{selectedUser.username}</h3>
                    <span className="user-status">🟢 Çevrimiçi</span>
                  </div>
                </div>
              </div>

              <div className="messages-list">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <p>{selectedUser.username} ile sohbete başlayın!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div 
                      key={msg.id || index} 
                      className={`message ${msg.isOwn ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        <p>{msg.content}</p>
                        <span className="message-time">
                          {new Date(msg.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="message-input-area">
                <input
                  type="text"
                  placeholder={`${selectedUser.username} ile mesajlaşın...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!isConnected}
                />
                <button 
                  onClick={sendPrivateMessage}
                  className="send-button"
                  disabled={!isConnected || !inputMessage.trim()}
                >
                  Gönder
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h3>Bir kullanıcı seçin</h3>
                <p>Mesajlaşmaya başlamak için soldan bir kullanıcı seçin</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Messages;