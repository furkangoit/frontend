import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [backendData, setBackendData] = useState({
    status: '',
    environment: '',
    database: '',
    timestamp: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBackendStatus = async () => {
      try {
        console.log('🔄 Backend verisi çekiliyor...');
        
        // PROXY kullanıyoruz (package.json'da ayarlı)
        const response = await fetch('/api/status');
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Backend hatası: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Backend verisi alındı:', data);
        
        setBackendData(data);
        setLoading(false);
        
      } catch (err) {
        console.error('❌ Hata:', err.message);
        setError(err.message);
        setLoading(false);
        
        // Fallback data
        setBackendData({
          status: 'error',
          environment: 'development',
          database: 'disconnected',
          timestamp: new Date().toISOString()
        });
      }
    };

    fetchBackendStatus();
  }, []);

  if (loading) {
    return (
      <div className="App">
        <div className="loading">
          <h2>🔄 Backend bağlantısı kuruluyor...</h2>
          <p>Port: 5001 - MongoDB Atlas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 FullStack Uygulaması</h1>
        <p>Frontend (React:3000) + Backend (Node.js:5001) + MongoDB Atlas</p>
        
        {error && (
          <div className="error">
            <h3>❌ Hata: {error}</h3>
            <p>Backend URL: http://localhost:5001/api/status</p>
            <button onClick={() => window.location.reload()}>
              Tekrar Dene
            </button>
          </div>
        )}

        <div className="backend-info">
          <h2>Backend Durumu:</h2>
          <div className="status-card">
            <p><strong>Status:</strong> {backendData.status || 'N/A'}</p>
            <p><strong>Environment:</strong> {backendData.environment || 'N/A'}</p>
            <p><strong>Database:</strong> {backendData.database || 'N/A'}</p>
            <p><strong>Time:</strong> {
              backendData.timestamp && backendData.timestamp !== 'Invalid Date' 
                ? new Date(backendData.timestamp).toLocaleString() 
                : 'Bağlantı yok'
            }</p>
          </div>
        </div>

        <div className="links">
          <a 
            href="http://localhost:5001/api/status" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn"
          >
            🔗 Backend API'yi Görüntüle
          </a>
          <a 
            href="https://cloud.mongodb.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn secondary"
          >
            📊 MongoDB Atlas Dashboard
          </a>
        </div>
      </header>
    </div>
  );
}

export default App;