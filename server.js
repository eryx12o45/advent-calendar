const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8088;
const PASSWORD = process.env.ADVENT_PASSWORD || 'advent2024';

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Get available years from audio folder
app.get('/api/years', (req, res) => {
    try {
        const audioPath = path.join(__dirname, 'public', 'audio');
        const items = fs.readdirSync(audioPath, { withFileTypes: true });
        const years = items
            .filter(item => item.isDirectory() && /^\d{4}$/.test(item.name))
            .map(item => item.name)
            .sort((a, b) => b.localeCompare(a)); // Sort descending (newest first)
        
        res.json({ success: true, years });
    } catch (error) {
        console.error('Error reading years:', error);
        res.json({ success: false, years: [] });
    }
});

// Password verification endpoint
app.post('/api/verify-password', (req, res) => {
    const { password } = req.body;
    
    if (password === PASSWORD) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🎄 Adventskalender läuft auf http://localhost:${PORT}`);
});
