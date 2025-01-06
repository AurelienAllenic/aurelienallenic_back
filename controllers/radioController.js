const Radio = require('../models/Radio');
const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { log } = require('console');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ajouter une radio
exports.addRadio = async (req, res) => {
    console.log("Données reçues :", req.body);
    const { title, date, guestsList, firstVideo, secondVideo, thirdVideo } = req.body;

    // Vérifier si tous les champs sont remplis
    if (!title || !date || !guestsList || !firstVideo || !secondVideo || !thirdVideo) {
        console.log("Champs manquants");
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    // Récupérer l'URL de l'image si un fichier est téléchargé
    
    if (req.file) {
        console.log(req.file.filename);
        
        image = `${req.file.filename}`; // Construire l'URL de l'image
    }

    try {
        const newRadio = new Radio({
            id: uuidv4(),
            title,
            date,
            guestsList,
            firstVideo,
            secondVideo,
            thirdVideo,
            image
        });

        await newRadio.save();
        res.status(201).json({ message: 'Radio créée avec succès', data: newRadio });
    } catch (error) {
        console.error("Erreur backend :", error);
        res.status(400).json({ message: 'Erreur lors de la création de la radio', error: error.message });
    }
};

// Trouver toutes les radios
exports.findAllRadios = async (req, res) => {
    try {
        const radios = await Radio.find();
        res.status(200).json({ message: 'Liste des radios', data: radios });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la récupération des radios', error: error.message });
    }
};

// Trouver une radio par ID
exports.findOneRadio = async (req, res) => {
    const { id } = req.params;

    try {
        const radio = await Radio.findById(id);
        if (!radio) {
            return res.status(404).json({ message: 'Radio non trouvée.' });
        }

        // Retourner la radio avec son image
        res.status(200).json({ message: 'Radio trouvée', data: radio });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la récupération de la radio', error: error.message });
    }
};

// Mettre à jour une radio
exports.updateRadio = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    console.log('Données reçues pour la mise à jour:', updateData);

    // Vérifier si une image est téléchargée
    if (req.file) {
        // Si une image est téléchargée, on met à jour l'URL de l'image
        const newImage = req.file.filename;

        // Trouver la radio avant de supprimer l'image existante
        const radio = await Radio.findById(id);
        if (!radio) {
            return res.status(404).json({ message: 'Radio non trouvée.' });
        }

        // Récupérer l'ancien public_id de l'image (si une image existe déjà)
        if (radio.image) {
            const oldImagePublicId = radio.image.split('/').pop().split('.')[0]; // Par exemple : "radioImage.jpg" => "radioImage"
            // Supprimer l'ancienne image de Cloudinary
            await cloudinary.uploader.destroy(oldImagePublicId, (error, result) => {
                if (error) {
                    console.log("Erreur Cloudinary :", error);
                    return res.status(500).json({ message: "Erreur lors de la suppression de l'ancienne image de Cloudinary.", error: error.message });
                }
                console.log("Ancienne image supprimée avec succès de Cloudinary :", result);
            });
        }
/*
        // Télécharger la nouvelle image sur Cloudinary
        await cloudinary.uploader.upload(req.file.path, (error, result) => {
            if (error) {
                console.log("Erreur lors du téléchargement de la nouvelle image :", error);
                return res.status(500).json({ message: "Erreur lors du téléchargement de l'image sur Cloudinary.", error: error.message });
            }

            console.log("Nouvelle image téléchargée avec succès sur Cloudinary :", result);
            updateData.image = result.secure_url; // Mise à jour de l'URL de l'image dans la base de données
        });
        */
    }

    try {
        if (!id) {
            return res.status(400).json({ message: 'ID manquant dans la requête.' });
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'Aucune donnée à mettre à jour.' });
        }

        const updatedRadio = await Radio.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedRadio) {
            return res.status(404).json({ message: 'Radio non trouvée.' });
        }

        res.status(200).json({ message: 'Radio mise à jour avec succès', data: updatedRadio });
    } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
        res.status(400).json({ message: 'Erreur lors de la mise à jour de la radio', error: error.message });
    }
};

// Supprimer une radio
exports.deleteRadio = async (req, res) => {
    const { id } = req.params;
    console.log("ID reçu pour suppression : ", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID invalide.' });
    }

    try {
        // Trouver la radio avant de supprimer l'image de Cloudinary
        const radio = await Radio.findById(id);
        if (!radio) {
            return res.status(404).json({ message: 'Radio non trouvée.' });
        }

        // Récupérer le public ID de l'image de Cloudinary
        const imagePublicId = radio.image.split('/').pop().split('.')[0]; // Par exemple : "radioImage.jpg" => "radioImage"
        /*
        // Supprimer l'image de Cloudinary
        await cloudinary.uploader.destroy(imagePublicId, (error, result) => {
            if (error) {
                console.log("Erreur Cloudinary :", error);
                return res.status(500).json({ message: "Erreur lors de la suppression de l'image de Cloudinary.", error: error.message });
            }
            console.log("Image supprimée avec succès de Cloudinary :", result);
        });
        */
        // Supprimer la radio de la base de données
        const result = await Radio.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Radio non trouvée.' });
        }

        res.status(200).json({ message: 'Radio supprimée avec succès.' });
    } catch (error) {
        console.error("Erreur lors de la suppression de la radio : ", error);
        res.status(400).json({ message: 'Erreur lors de la suppression de la radio', error: error.message });
    }
};
