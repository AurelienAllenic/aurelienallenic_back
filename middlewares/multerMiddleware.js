const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configurer Cloudinary avec les variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuration du stockage Multer-Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Dossier dans Cloudinary
    format: async (req, file) => 'png', // Convertir en PNG
    public_id: (req, file) => Date.now() // Nom unique basé sur la date
  }
});

const upload = multer({ storage: storage });

// Middleware pour gérer l'upload d'une image
exports.uploadImage = upload.single('image');

// Middleware pour supprimer une image de Cloudinary
exports.deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Image supprimée avec succès de Cloudinary :', result);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image de Cloudinary :', error);
  }
};
