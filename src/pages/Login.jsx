import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('ahmet@example.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Login denemesi:', email);
      
      // Backend API'ye login isteği
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Login başarılı:', response.data);
      
      if (response.data.success) {
        // AuthContext'e kullanıcı bilgilerini kaydet
        login(response.data.user, response.data.token);
        
        // Ana sayfaya yönlendir
        navigate('/');
      } else {
        setError('Giriş başarısız!');
      }
    } catch (err) {
      console.error('Login hatası:', err);
      setError('Sunucu bağlantı hatası. Backend çalışıyor mu?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            SocialApp'a Giriş Yap
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Direct Messaging ile sosyal medya deneyimi
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <strong>Hata:</strong> {error}
            <div className="mt-2 text-sm">
              <p>Backend'i kontrol edin: <code>localhost:5000</code></p>
              <p>Demo email: <strong>ahmet@example.com</strong></p>
              <p>Şifre gerekmez</p>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email Adresi</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email Adresi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Şifre</label>
              <input
                id="password"
                name="password"
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Şifre (Herhangi bir şifre çalışır)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="text-sm text-center">
            <p className="text-gray-600">
              Demo hesaplar:
            </p>
            <div className="mt-1 space-y-1">
              <p><strong>ahmet@example.com</strong> - Ahmet</p>
              <p><strong>zeynep@example.com</strong> - Zeynep</p>
              <p><strong>mehmet@example.com</strong> - Mehmet</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  </span>
                  Giriş Yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Kayıt Ol
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="text-sm font-medium text-yellow-800">Debug Bilgisi</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>Backend URL: <code>http://localhost:5000</code></p>
            <p>Login Endpoint: <code>/api/auth/login</code></p>
            <button
              onClick={() => {
                // Backend'i test et
                fetch('http://localhost:5000/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: 'ahmet@example.com' })
                })
                .then(res => res.json())
                .then(data => console.log('Test sonucu:', data))
                .catch(err => console.error('Test hatası:', err));
              }}
              className="mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded"
            >
              Backend'i Test Et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;