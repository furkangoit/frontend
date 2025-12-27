// src/services/api.js - TAM VERSİYON
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

let socket = null;

// Socket bağlantısı
export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5
    });
    
    socket.on('connect', () => {
      console.log('✅ Socket bağlantısı kuruldu');
    });
    
    socket.on('disconnect', () => {
      console.log('❌ Socket bağlantısı kesildi');
    });
  }
  return socket;
};

// API fonksiyonları
export const getPosts = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`${API_URL}/posts?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('API bağlantı hatası');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Kullanıcılar yüklenemedi');
    return await response.json();
  } catch (error) {
    console.error('Users Error:', error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error('Gönderi oluşturulamadı');
    return await response.json();
  } catch (error) {
    console.error('Create Post Error:', error);
    throw error;
  }
};

export const likePost = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Beğeni gönderilemedi');
    return await response.json();
  } catch (error) {
    console.error('Like Error:', error);
    throw error;
  }
};

export const addComment = async (postId, commentData) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) throw new Error('Yorum gönderilemedi');
    return await response.json();
  } catch (error) {
    console.error('Comment Error:', error);
    throw error;
  }
};

// Socket event listener'ları
export const onPostCreated = (callback) => {
  const socket = connectSocket();
  socket.on('postCreated', callback);
  return () => socket.off('postCreated', callback);
};

export const onPostLiked = (callback) => {
  const socket = connectSocket();
  socket.on('postLiked', callback);
  return () => socket.off('postLiked', callback);
};

export const onCommentAdded = (callback) => {
  const socket = connectSocket();
  socket.on('commentAdded', callback);
  return () => socket.off('commentAdded', callback);
};

export const onOnlineUsers = (callback) => {
  const socket = connectSocket();
  socket.on('onlineUsers', callback);
  return () => socket.off('onlineUsers', callback);
};