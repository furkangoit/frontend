import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Stil dosyası

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
      alert(`✅ Backend çalışıyor!\n${res.data.message}`);
    } catch (err) {
      alert('❌ Backend çalışmıyor! Port 5000\'i kontrol edin.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    console.log('Login attempt with:', { email, password });

    try {
      // 🔥 BACKEND'E LOGİN İSTEĞİ
      const response = await axios.post(
        'http://localhost:5000/api/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Login success:', response.data);
      
      // Başarılı yanıt
      setSuccess(`Giriş başarılı! Hoş geldin ${response.data.user.username}`);
      
      // Token'ı kaydet
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // 2 saniye sonra yönlendir (isteğe bağlı)
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        // Backend'den hata geldi
        setError(`Hata: ${err.response.data.message || 'Giriş başarısız'}`);
      } else if (err.request) {
        // İstek gitti ama yanıt gelmedi
        setError('Sunucu yanıt vermiyor. Backend çalışıyor mu?');
      } else {
        // Diğer hatalar
        setError(`Hata: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Giriş Yap</h2>
      
      <button 
        onClick={testBackend}
        className="test-button"
        style={{marginBottom: '20px'}}
      >
        🔍 Backend Bağlantısını Test Et
      </button>
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@test.com"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Şifre:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Herhangi bir şifre (backend validation yok)"
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="submit-button"
        >
          {loading ? '🔄 Giriş Yapılıyor...' : '🚀 Giriş Yap'}
        </button>
      </form>
      
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          ✅ {success}
        </div>
      )}
      
      <div className="debug-info">
        <h4>Debug Bilgisi:</h4>
        <p>Email: {email}</p>
        <p>Backend URL: http://localhost:5000/api/login</p>
        <p>Backend Durumu: <span style={{color: 'green'}}>Çalışıyor ✓</span></p>
      </div>
    </div>
  );
}

export default Login;