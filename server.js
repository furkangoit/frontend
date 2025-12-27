
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// CORS ayarları
app.use(cors({
    origin: 'http://localhost:3000', // React uygulamanızın portu
    credentials: true
}));

// API route'ları
app.get('/api/posts', (req, res) => {
    res.json([
        { id: 1, title: 'İlk gönderi', content: '...' },
        // ... diğer gönderiler
    ]);
});

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});