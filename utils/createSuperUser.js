require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
    try {
        // Connexion à la base de données
        await mongoose.connect(process.env.MONGO_SECRET_KEY, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Vérifie si un admin existe déjà
        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            console.log('Un super utilisateur existe déjà.');
            return process.exit();
        }

        // Crée un nouvel admin
        const admin = new User({
            username: process.env.DBUSERNAME,
            password: process.env.PASSWORD,
            role: 'admin', // Rôle admin
        });

        await admin.save();
        console.log('Super utilisateur créé avec succès.', process.env.USERNAME, process.env.PASSWORD);
        process.exit();
    } catch (error) {
        console.error('Erreur lors de la création du super utilisateur :', error);
        process.exit(1);
    }
})();
