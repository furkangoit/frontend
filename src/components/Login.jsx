import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Backend bağlantı testi
  const testBackend = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/health');
      alert(`✅ Backend çalışıyor!\nMesaj: ${res.data.message}\nPort: ${res.data.port}`);
    } catch (err) {
      alert('❌ Backend çalışmıyor!\nLütfen terminalde backend klasöründe "npm run dev" komutunu çalıştırın.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    console.log('🔐 Login denemesi:', { email, password });

    try {
      // BACKEND'E LOGIN İSTEĞİ
      const response = await axios.post(
        'http://localhost:5000/api/login',
        { 
          email: email.trim(),
          password: password.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 saniye timeout
        }
      );

      console.log('✅ Login başarılı:', response.data);
      
      // Başarılı mesaj
      setSuccess(`🎉 Giriş başarılı! Hoş geldin ${response.data.user.username}`);
      
      // Token ve kullanıcı bilgilerini kaydet
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('💾 Token kaydedildi:', response.data.token.substring(0, 20) + '...');
      console.log('👤 Kullanıcı:', response.data.user);
      
      // 3 saniye sonra dashboard'a yönlendir
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);

    } catch (err) {
      console.error('❌ Login hatası:', err);
      
      if (err.response) {
        // Backend'den hata geldi (400, 500 vs.)
        console.log('📡 Backend yanıtı:', err.response.data);
        setError(`❌ Hata: ${err.response.data.message || 'Giriş başarısız'}`);
      } else if (err.request) {
        // İstek gitti ama yanıt gelmedi
        console.log('🌐 İstek gönderildi ama yanıt alınamadı');
        setError('🌐 Sunucu yanıt vermiyor. Backend çalışıyor mu?');
      } else {
        // Diğer hatalar
        console.log('⚠️ Diğer hata:', err.message);
        setError(`⚠️ Hata: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Debug: Local Storage'ı temizle
  const clearStorage = () => {
    localStorage.clear();
    alert('🗑️ Local Storage temizlendi!');
  };

  // Debug: Local Storage'ı göster
  const showStorage = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    alert(`Token: ${token ? token.substring(0, 30) + '...' : 'Yok'}\nUser: ${user || 'Yok'}`);
  };

  return (
    <div className="login-container">
      <h1>🔐 SocialApp Giriş</h1>
      <p className="subtitle">Backend ile bağlantı testi</p>
      
      <div className="button-group">
        <button 
          onClick={testBackend}
          className="test-button"
        >
          🔍 Backend Testi
        </button>
        
        <button 
          onClick={clearStorage}
          className="debug-button"
        >
          🗑️ Temizle
        </button>
        
        <button 
          onClick={showStorage}
          className="debug-button"
        >
          👁️ Göster
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">📧 Email Adresi:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@email.com"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">🔑 Şifre:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
            required
            disabled={loading}
          />
          <small className="hint">Backend şifre kontrolü yapmıyor, her şifre çalışır</small>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="submit-button"
        >
          {loading ? (
            <>
              <span className="spinner">🔄</span> Giriş Yapılıyor...
            </>
          ) : (
            '🚀 Giriş Yap'
          )}
        </button>
      </form>
      
      {error && (
        <div className="error-message">
          <strong>❌ HATA:</strong> {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          <strong>✅ BAŞARILI:</strong> {success}
          <p className="redirect-message">Dashboard'a yönlendiriliyorsunuz...</p>
        </div>
      )}
      
      <div className="debug-info">
        <h3>🐞 Debug Bilgileri</h3>
        <div className="debug-grid">
          <div className="debug-item">
            <strong>📧 Email:</strong> {email}
          </div>
          <div className="debug-item">
            <strong>🔗 Backend URL:</strong> http://localhost:5000
          </div>
          <div className="debug-item">
            <strong>🎯 API Endpoint:</strong> /api/login
          </div>
          <div className="debug-item">
            <strong>⚡ Durum:</strong> 
            <span className="status-indicator active">Çalışıyor</span>
          </div>
          <div className="debug-item">
            <strong>🔄 Yükleme:</strong> {loading ? 'Evet' : 'Hayır'}
          </div>
          <div className="debug-item">
            <strong>🔑 Token:</strong> 
            {localStorage.getItem('token') 
              ? '✅ Kayıtlı' 
              : '❌ Yok'}
          </div>
        </div>
        
        <div className="instructions">
          <h4>📋 Test Talimatları:</h4>
          <ol>
            <li>Backend Testi butonuna tıkla</li>
            <li>Email ve şifreyi gir</li>
            <li>Giriş Yap butonuna tıkla</li>
            <li>Console'da (F12) Network sekmesini izle</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Login;