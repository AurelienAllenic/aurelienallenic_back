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

        // Salage et hachage du mot de passe
        const salt = await bcrypt.genSalt(10);  // Générer un sel
        const hashedPassword = await bcrypt.hash(password, salt);  // Hacher le mot de passe

        // Création de l'utilisateur avec le mot de passe haché
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription.', error });
    }
};

// Connexion
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        // Génération du token JWT avec le rôle de l'utilisateur
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.MONGO_SECRET_KEY || 'secret_key',
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Connexion réussie.', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la connexion.' });
    }
};
