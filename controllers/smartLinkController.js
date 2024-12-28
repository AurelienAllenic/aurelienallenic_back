const SmartLink = require('../models/SmartLink');
const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

// Ajouter un lien
exports.addSmartLink = async (req, res) => {
    console.log("Données reçues :", req.body);
    const { title, linkType, titleType, modifiedTitle, link } = req.body;

    if (!title || !linkType || !titleType || !modifiedTitle || !link) {
        console.log("Champs manquants");
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        const newSmartLink = new SmartLink({ 
            id: uuidv4(),
            title, 
            linkType, 
            titleType, 
            modifiedTitle, 
            link
        });
        await newSmartLink.save();
        res.status(201).json({ message: 'SmartLink créé avec succès', data: newSmartLink });
    } catch (error) {
        console.error("Erreur backend :", error);
        res.status(400).json({ message: 'Erreur lors de la création de la radio', error: error.message });
    }
};


exports.findAllSmartLinks = async (req, res) => {
    try {
        const smartLinks = await SmartLink.find();
        res.status(200).json({ message: 'Liste des smartLinks', data: smartLinks });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la récupération des smartLinks', error: error.message });
    }
};


exports.findOneSmartLink = async (req, res) => {
    const { id } = req.params;

    try {
        const smartLink = await SmartLink.findById(id);
        if (!smartLink) {
            return res.status(404).json({ message: 'SmartLink non trouvé.' });
        }

        res.status(200).json({ message: 'smartLink trouvé', data: smartLink });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la récupération du smartLink', error: error.message });
    }
};


exports.updateSmartLink = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    console.log('Données reçues pour la mise à jour:', updateData);

    try {
        if (!id) {
            return res.status(400).json({ message: 'ID manquant dans la requête.' });
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'Aucune donnée à mettre à jour.' });
        }

        const updatedSmartLink = await SmartLink.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedSmartLink) {
            return res.status(404).json({ message: 'SmartLink non trouvé.' });
        }

        res.status(200).json({ message: 'SmartLink mis à jour avec succès', data: updatedSmartLink });
    } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
        res.status(400).json({ message: 'Erreur lors de la mise à jour du SmartLink', error: error.message });
    }
};


exports.deleteSmartLink = async (req, res) => {
    const { id } = req.params;
    console.log("ID reçu pour suppression : ", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID invalide.' });
    }

    try {
        const result = await SmartLink.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'SmartLink non trouvé.' });
        }

        res.status(200).json({ message: 'SmartLink supprimé avec succès.' });
    } catch (error) {
        console.error("Erreur lors de la suppression du SmartLink : ", error);
        res.status(400).json({ message: 'Erreur lors de la suppression du SmartLink', error: error.message });
    }
};
