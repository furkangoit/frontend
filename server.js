// server.js - Backend API (5000 portu)
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'backend-api',
        port: 5000,
        timestamp: new Date().toISOString(),
        message: 'Backend canlı!'
    });
});

// Kullanıcılar endpoint'i
app.get('/api/users', (req, res) => {
    res.json([
        { id: 1, name: 'Ali', role: 'Admin' },
        { id: 2, name: 'Zeynep', role: 'User' },
        { id: 3, name: 'Can', role: 'Editor' }
    ]);
});

// POST endpoint
app.post('/api/message', (req, res) => {
    const { text } = req.body;
    res.json({
        received: text,
        echoed: `Backend'den cevap: ${text}`,
        success: true,
        timestamp: new Date().toISOString()
    });
});

// 5000 portunda başlat
const PORT = 5000;
app.listen(PORT, () => {
    console.log('═══════════════════════════════════════');
    console.log('🚀 BACKEND BAŞLATILDI');
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}/api/health`);
    console.log('═══════════════════════════════════════');
});