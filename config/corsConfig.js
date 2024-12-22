const cors = require('cors');

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://aurelienallenic.fr',
            'http://localhost:5173',
            'http://localhost:5174',
            'https://paro-officiel.com',
            'https://paro-musique.com',
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy: Origin not allowed'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); // Assure-toi d'ajouter cette ligne avant les autres middlewares

// Autres middlewares
app.options('*', cors(corsOptions));  // CORS pour les requêtes OPTIONS
