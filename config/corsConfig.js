const cors = require('cors');

const corsOptions = {
    origin: [
        'https://aurelienallenic.fr',
        'http://localhost:5173',
        'http://localhost:5174',
        'https://paro-officiel.com',
        'https://paro-musique.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = cors(corsOptions);
