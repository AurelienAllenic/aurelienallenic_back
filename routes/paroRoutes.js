const express = require('express');
const router = express.Router();
const radioController = require('../controllers/radioController');
const smartLinkController = require('../controllers/smartLinkController');
const auth = require('../middlewares/authMiddleware');

// RADIO ROUTES
router.post('/add-radio', auth, radioController.addRadio);
router.get('/radios', radioController.findAllRadios);
router.get('/radios/:id', radioController.findOneRadio);
router.put('/radios/:id', auth, radioController.updateRadio);
router.delete('/radios/:id', auth, radioController.deleteRadio);

// SMART LINK ROUTES

router.post('/add-smart-link', auth, smartLinkController.addSmartLink);
router.get('/smart-links', smartLinkController.findAllSmartLinks);
router.get('/smart-links/:id', smartLinkController.findOneSmartLink);
router.put('/smart-links/:id', auth, smartLinkController.updateSmartLink);
router.delete('/smart-links/:id', auth, smartLinkController.deleteSmartLink);

module.exports = router;
