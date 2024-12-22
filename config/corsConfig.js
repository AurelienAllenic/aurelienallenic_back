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

// Middleware CORS
const corsConfig = (req, res, next) => {
    cors(corsOptions)(req, res, () => {
        // Gérer les pré-vols (OPTIONS) ici
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            return res.status(200).send();
        }
        next();
    });
};

module.exports = corsConfig;
