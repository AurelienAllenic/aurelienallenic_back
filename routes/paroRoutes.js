const express = require('express');
const router = express.Router();
const radioController = require('../controllers/radioController');
const auth = require('../middlewares/authMiddleware');

// Route pour ajouter une radio
router.post('/add-radio', auth, radioController.addRadio);

// Route pour récupérer toutes les radios
router.get('/radios', radioController.findAllRadios);

// Route pour trouver une radio par ID
router.get('/radios/:id', radioController.findOneRadio);

// Route pour mettre à jour une radio
router.put('/radios/:id', auth, radioController.updateRadio);

// Route pour supprimer une radio
router.delete('/radios/:id', auth, radioController.deleteRadio);

module.exports = router;
