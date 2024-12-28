const express = require('express');
const { incrementCounter, getCounter } = require('../controllers/counterController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

// Route pour incrémenter le compteur 'qrClickCount'
router.get('/increment-qr', (req, res) => incrementCounter(req, res, 'qrClickCount'));

// Route pour vérifier le compteur 'qrClickCount'
router.get('/check-qr-clicks', auth, (req, res) => getCounter(req, res, 'qrClickCount'));

// Route pour incrémenter le compteur 'visits'
router.get('/increment-visits', (req, res) => incrementCounter(req, res, 'visits'));

// Route pour vérifier le compteur 'visits'
router.get('/check-visits', auth, (req, res) => getCounter(req, res, 'visits'));

// Route générique pour incrémenter un compteur par son nom
router.get('/increment-counter/:name', (req, res) => {
    const { name } = req.params;
    incrementCounter(req, res, name);
});

// Route générique pour vérifier un compteur par son nom
router.get('/check-counter/:name', auth, (req, res) => {
    const { name } = req.params;
    getCounter(req, res, name);
});

module.exports = router;
