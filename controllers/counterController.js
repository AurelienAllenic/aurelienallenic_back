const Counter = require('../models/Counter');

// Fonction pour incrémenter le compteur
const incrementCounter = async (req, res, nameNotFromParams) => {
    // Vérifier si nameNotFromParams est défini, sinon prendre le nom depuis les paramètres de l'URL
    const name = nameNotFromParams || req.params.name;

    try {
        // Chercher le compteur par son nom, sinon le créer avec un count initial à 0
        const counter = await Counter.findOneAndUpdate(
            { name },
            { $inc: { count: 1 } }, // Incrémente le compteur
            { new: true, upsert: true } // Crée un nouveau compteur s'il n'existe pas
        );
        res.status(200).json({ success: true, count: counter.count });
    } catch (error) {
        console.error(`Erreur lors de l'incrémentation (${name}):`, error);
        res.status(500).json({ success: false });
    }
};


const getCounter = async (req, res, nameNotFromParams) => {
    // Vérifier si nameNotFromParams est défini, sinon prendre le nom depuis les paramètres de l'URL
    const name = nameNotFromParams || req.params.name;

    console.log("Nom du compteur :", name);  // Debug : afficher le nom du compteur

    try {
        // Chercher le compteur par son nom, ou initialiser à 0 si non trouvé
        const counter = await Counter.findOne({ name }) || { count: 0 };
        res.status(200).json({ count: counter.count });
    } catch (error) {
        console.error(`Erreur lors de la récupération (${name}):`, error);
        res.status(500).json({ success: false });
    }
};

module.exports = { incrementCounter, getCounter };

