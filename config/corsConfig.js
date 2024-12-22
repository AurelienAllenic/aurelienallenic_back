const cors = require('cors');

const corsOptions = {
    origin: (origin, callback) => {
        // Liste des origines autorisées
        const allowedOrigins = [
            'https://aurelienallenic.fr',
            'http://localhost:5173',
            'http://localhost:5174',
            'https://paro-officiel.com',
            'https://paro-musique.com'
        ];

        // Vérifier si l'origine de la requête est dans la liste des origines autorisées
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true); // Accepte la requête
        } else {
            callback(new Error('CORS policy: Origin not allowed'), false); // Refuse la requête
        }
    },
    credentials: true, // Permet d'envoyer des cookies si nécessaire
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware CORS
const corsConfig = (req, res, next) => {
    cors(corsOptions)(req, res, () => {
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            return res.status(200).send();
        }
        next();
    });
};

module.exports = corsConfig;
