const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const corsConfig = require('./config/corsConfig');
const limiter = require('./config/rateLimiter');

const counterRoutes = require('./routes/counterRoutes');
const emailRoutes = require('./routes/emailRoutes');
const authRoutes = require('./routes/authRoutes'); // Routes d'authentification
const paroRoutes = require('./routes/paroRoutes');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Connexion à MongoDB
connectDB();

// Middleware : Application de CORS et gestion des pré-vols (OPTIONS)
app.use(corsConfig);  // Applique la configuration CORS à toutes les routes
app.options('*', corsConfig); // CORS pour les requêtes OPTIONS (prérequis pour certaines requêtes HTTP comme POST)

// Middleware pour parser le corps des requêtes JSON
app.use(bodyParser.json());

// Routes existantes (tu peux ajouter ou modifier selon tes besoins)
app.use(counterRoutes);
app.use(emailRoutes);
app.use(paroRoutes);

// Routes pour l'authentification
app.use('/auth', authRoutes);  // Préfixe '/auth' pour éviter tout conflit avec d'autres routes

// Route par défaut pour tester que le serveur fonctionne
app.get('/', (req, res) => res.send('Hello World!'));

// Démarrer le serveur
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
