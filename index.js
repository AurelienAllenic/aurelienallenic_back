const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const corsConfig = require('./config/corsConfig');
const limiter = require('./config/rateLimiter');

const counterRoutes = require('./routes/counterRoutes');
const emailRoutes = require('./routes/emailRoutes');
const authRoutes = require('./routes/authRoutes'); // Ajout des routes d'authentification

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Connexion à MongoDB
connectDB();

// Middlewares
app.use(limiter);
app.use(corsConfig);
app.use(bodyParser.json());

// Routes existantes
app.use(counterRoutes);
app.use(emailRoutes);

// Routes pour l'authentification
app.use('/auth', authRoutes); // Ajout du préfixe '/auth' pour éviter les conflits

// Route par défaut
app.get('/', (req, res) => res.send('Hello World!'));

// Démarrage du serveur
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
