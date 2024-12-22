const rateLimit = require('express-rate-limit');

// Définir un rate limiter pour les tentatives de connexion
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limite de 5 tentatives par fenêtre de 15 minutes
    message: 'Trop de tentatives de connexion. Veuillez réessayer plus tard.',
    statusCode: 429, // Code de statut HTTP pour trop de tentatives
});

module.exports = { loginLimiter };
