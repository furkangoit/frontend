
// services/api.js - GÜNCELLENMİŞ VERSİYON
const API_URL = 'http://localhost:5000';

// Genel API istek fonksiyonu
export const api = {
  // Test endpoint
  async getHealth() {
    const response = await fetch(`${API_URL}/api/health`);
    return response.json();
  },

  // Auth işlemleri
  async login(email, password) {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  // Kullanıcılar
  async getUsers() {
    const response = await fetch(`${API_URL}/api/users`);
    return response.json();
  },

  // Gönderiler
  async getPosts() {
    const response = await fetch(`${API_URL}/api/posts`);
    const data = await response.json();
    return data.data || []; // Backend'den gelen yapıya göre
  },

  // Socket.io bağlantısı
  connectSocket() {
    // Socket.io bağlantısını yönetmek için
    return window.io(`${API_URL}`);
  }
};