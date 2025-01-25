const Radio = require('../models/Radio');
const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
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
    if (!title || !date || !guestsList) {
        console.log("Champs manquants");
        return res.status(400).json({ message: 'Tous les champs sont requis sauf les vidéos.' });
    }

    let image = '';

    // Vérifier si un fichier image est téléchargé
    if (req.file) {
        console.log(req.file.filename);

        // Télécharger l'image sur Cloudinary
        try {
            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
            console.log("Image téléchargée avec succès sur Cloudinary :", cloudinaryResult);
            image = cloudinaryResult.secure_url;
        } catch (error) {
            console.error("Erreur lors du téléchargement de l'image sur Cloudinary :", error);
            return res.status(500).json({ message: "Erreur lors du téléchargement de l'image sur Cloudinary.", error: error.message });
        }
    }

    try {
        const newRadio = new Radio({
            id: uuidv4(),
            title,
            date,
            guestsList,
            firstVideo: firstVideo || null,
            secondVideo: secondVideo || null,
            thirdVideo: thirdVideo || null,
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

    try {
        if (!id) {
            return res.status(400).json({ message: 'ID manquant dans la requête.' });
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'Aucune donnée à mettre à jour.' });
        }

        const radio = await Radio.findById(id);
        if (!radio) {
            return res.status(404).json({ message: 'Radio non trouvée.' });
        }

        if (req.file) {
            const filePath = req.file.path;

            // Télécharger l'image sur Cloudinary
            try {
                const cloudinaryResult = await cloudinary.uploader.upload(filePath);
                console.log("Image téléchargée avec succès sur Cloudinary :", cloudinaryResult);

                updateData.image = cloudinaryResult.secure_url;
            } catch (error) {
                console.error("Erreur lors du téléchargement de l'image sur Cloudinary :", error);
                return res.status(500).json({ message: "Erreur lors du téléchargement de l'image sur Cloudinary.", error: error.message });
            }
        } else {
            updateData.image = radio.image;
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
        const radio = await Radio.findById(id);
        if (!radio) {
            return res.status(404).json({ message: 'Radio non trouvée.' });
        }

        // Optionnel : Si vous souhaitez supprimer l'image de Cloudinary, vous pouvez décommenter cette partie.
        // const imagePublicId = radio.image.split('/').pop().split('.')[0]; // Exemple : "radioImage.jpg" => "radioImage"

        // Supprimer la radio de la base de données
        const result = await Radio.deleteOne({ _id: id });
        console.log("Résultat de la suppression : ", result);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Radio non trouvée.' });
        }

        res.status(200).json({ message: 'Radio supprimée avec succès.' });
    } catch (error) {
        console.error("Erreur lors de la suppression de la radio : ", error);
        res.status(400).json({ message: 'Erreur lors de la suppression de la radio', error: error.message });
    }
};
