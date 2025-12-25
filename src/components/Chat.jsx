import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

function Chat() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('genel');
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Socket.io bağlantısı
  useEffect(() => {
    console.log('🔄 Socket.io bağlanıyor...');
    
    // Socket.io bağlantısını oluştur
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });
    
    setSocket(newSocket);

    // Bağlantı event'leri
    newSocket.on('connect', () => {
      console.log('✅ Socket.io bağlantısı kuruldu:', newSocket.id);
      setConnected(true);
      
      // Genel odaya katıl
      newSocket.emit('join_room', 'genel');
    });

    newSocket.on('message', (msg) => {
      console.log('📨 Sistem mesajı:', msg);
      setMessages(prev => [...prev, {
        text: msg,
        sender: 'Sistem',
        timestamp: new Date().toLocaleTimeString()
      }]);
    });

    newSocket.on('receive_message', (data) => {
      console.log('📩 Kullanıcı mesajı:', data);
      setMessages(prev => [...prev, {
        text: data.message,
        sender: data.sender || 'Anonim',
        timestamp: new Date().toLocaleTimeString(),
        room: data.room
      }]);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket.io bağlantısı kesildi');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket.io bağlantı hatası:', error);
      setConnected(false);
    });

    // Cleanup
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Mesaj gönderme
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket || !connected) return;

    const messageData = {
      room: room,
      message: message,
      sender: 'Kullanıcı'
    };

    socket.emit('send_message', messageData);
    setMessage('');
  };

  // Odaya katılma
  const joinRoom = (roomName) => {
    if (socket && connected) {
      socket.emit('join_room', roomName);
      setRoom(roomName);
      setMessages(prev => [...prev, {
        text: `${roomName} odasına geçtiniz`,
        sender: 'Sistem',
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  // Scroll en alta
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>💬 Real-Time Chat</h1>
      
      <div style={{
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h3>🔌 Bağlantı Durumu</h3>
        <p>
          Socket.io: 
          <span style={{
            color: connected ? 'green' : 'red',
            fontWeight: 'bold',
            marginLeft: '10px'
          }}>
            {connected ? '✅ Bağlı' : '❌ Bağlı Değil'}
          </span>
        </p>
        <p>Oda: <strong>{room}</strong></p>
        <p>Backend: ws://localhost:5000</p>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={() => joinRoom('genel')}
            style={{
              padding: '8px 15px',
              background: room === 'genel' ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            #genel
          </button>
          <button 
            onClick={() => joinRoom('yardım')}
            style={{
              padding: '8px 15px',
              background: room === 'yardım' ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            #yardım
          </button>
          <button 
            onClick={() => joinRoom('sohbet')}
            style={{
              padding: '8px 15px',
              background: room === 'sohbet' ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            #sohbet
          </button>
        </div>
      </div>

      {/* Mesajlar */}
      <div style={{
        height: '400px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '15px',
        marginBottom: '20px',
        overflowY: 'auto',
        background: 'white'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
            <p>💬 Henüz mesaj yok</p>
            <p>İlk mesajı sen gönder!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index}
              style={{
                marginBottom: '15px',
                padding: '10px',
                background: msg.sender === 'Sistem' ? '#e8f4fc' : '#f8f9fa',
                borderRadius: '8px',
                borderLeft: `4px solid ${msg.sender === 'Sistem' ? '#3498db' : '#2ecc71'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{msg.sender}</strong>
                <small style={{ color: '#7f8c8d' }}>{msg.timestamp}</small>
              </div>
              <p style={{ margin: '5px 0 0 0' }}>{msg.text}</p>
              {msg.room && (
                <small style={{ color: '#95a5a6' }}>#{msg.room}</small>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Mesaj gönderme formu */}
      <form onSubmit={sendMessage}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            disabled={!connected}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
          <button
            type="submit"
            disabled={!connected || !message.trim()}
            style={{
              padding: '12px 25px',
              background: connected ? '#007bff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: connected ? 'pointer' : 'not-allowed',
              fontSize: '16px'
            }}
          >
            {connected ? '📤 Gönder' : 'Bağlanıyor...'}
          </button>
        </div>
      </form>

      {/* Debug bilgisi */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        <h4>🐞 Debug Bilgisi</h4>
        <p><strong>Socket.io Durumu:</strong> {connected ? 'Bağlı' : 'Bağlı Değil'}</p>
        <p><strong>WebSocket URL:</strong> ws://localhost:5000</p>
        <p><strong>Mesaj Sayısı:</strong> {messages.length}</p>
        <p><strong>Aktif Oda:</strong> {room}</p>
      </div>
    </div>
  );
}

export default Chat;