const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration de multer pour gérer l'upload des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Créer le dossier s'il n'existe pas
    }
    cb(null, uploadDir); // Le dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname); // Générer un nom unique
    cb(null, uniqueSuffix); // Nom du fichier après modification
  }
});

const upload = multer({ storage: storage });

// Middleware pour gérer l'upload d'une image (pour la création ou la mise à jour)
exports.uploadImage = upload.single('image');

// Middleware pour supprimer l'image dans le dossier uploads
exports.deleteImage = (imagePath) => {
  if (imagePath) {
    const fullPath = path.join(__dirname, '..', imagePath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error('Erreur lors de la suppression de l\'image :', err);
      } else {
        console.log('Image supprimée avec succès.');
      }
    });
  }
};
