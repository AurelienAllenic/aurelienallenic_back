const cors = require('cors');

// Définition des options CORS
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://aurelienallenic.fr',
            'http://localhost:5173',
            'http://localhost:5174',
            'https://paro-officiel.com',
            'https://paro-musique.com',
        ];

        // Si l'origine est autorisée ou qu'il n'y a pas d'origine (cas de requêtes locales), autoriser la requête
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Si l'origine n'est pas autorisée, renvoyer une erreur CORS
            callback(new Error('CORS policy: Origin not allowed'));
        }
    },
    credentials: true,  // Permet l'envoi de cookies ou d'en-têtes d'authentification avec la requête
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Méthodes HTTP autorisées
    allowedHeaders: ['Content-Type', 'Authorization'],  // En-têtes autorisés
};

// Middleware CORS qui appliquera les options définies ci-dessus
const corsConfig = (req, res, next) => {
    cors(corsOptions)(req, res, () => {
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
