const express = require('express');
const { incrementCounter, getCounter } = require('../controllers/counterController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/increment-qr', (req, res) => incrementCounter(req, res, 'qrClickCount'));

router.get('/check-qr-clicks', auth, (req, res) => getCounter(req, res, 'qrClickCount'));

router.get('/increment-visits', (req, res) => incrementCounter(req, res, 'visits'));

router.get('/check-visits', auth, (req, res) => getCounter(req, res, 'visits'));

router.get('/increment-counter/:name', (req, res) => {
    const { name } = req.params;
    incrementCounter(req, res, name);
});

router.get('/check-counter/:name', auth, (req, res) => {
    const { name } = req.params;
    getCounter(req, res, name);
});

module.exports = router;
