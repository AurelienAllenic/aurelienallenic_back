const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

// Middleware pour vérifier si l'utilisateur est admin
exports.isAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Token manquant ou invalide.' });
    }

    const token = authHeader.split(' ')[1]; // Récupère le token après "Bearer"
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
        }

        req.user = decoded; // Ajoute les infos décodées à la requête
        next(); // Passe au middleware suivant ou à la route
    } catch (error) {
        res.status(403).json({ message: 'Token invalide ou expiré.' });
    }
};
