const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

// Inscription
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
        }
        const newUser = new User({ username, password: password });
        await newUser.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription.', error });
    }
};



// Connexion
exports.login = (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }

            // On nettoie les espaces éventuels avant de comparer
            bcrypt.compare(req.body.password.trim(), user.password)
                .then(valid => {

                    if (!valid) {
                        console.log('Paire username/password incorrecte');
                        return res.status(401).json({ error: 'Paire username/password incorrecte !' });
                    }

                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.RANDOM_SECRET_TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => {
                    console.error('Erreur bcrypt:', error);
                    res.status(500).json({ error });
                });
        })
        .catch(error => {
            console.error('Erreur lors de la recherche de l\'utilisateur:', error);
            res.status(500).json({ error });
        });
};

exports.verifyToken = (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'Token manquant ou invalide.', isValid: false });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = jwt.verify(token, process.env.RANDOM_SECRET_TOKEN || 'secret_key');
        res.status(200).json({ isValid: true, message: 'Token valide.', userId: decodedToken.userId });
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        res.status(401).json({ isValid: false, message: 'Token invalide.' });
    }
};
