const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configurer Cloudinary avec les variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuration du stockage Multer-Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: '', // Dossier dans Cloudinary
    format: async (req, file) => file.mimetype.split('/')[1], // Conserver le format original
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`, // Nom unique
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5 Mo
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Seuls les formats JPEG, PNG et GIF sont autorisés.');
      error.code = 'INVALID_FILE_TYPE';
      return cb(error, false);
    }
    cb(null, true);
  },
});

// Middleware pour gérer l'upload d'une image
exports.uploadImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Erreur lors de l\'upload :', err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// Middleware pour supprimer une image de Cloudinary
exports.deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Image supprimée avec succès de Cloudinary :', result);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image de Cloudinary :', error);
  }
};
