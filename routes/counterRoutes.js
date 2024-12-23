const express = require('express');
const { incrementCounter, getCounter } = require('../controllers/counterController');

const router = express.Router();

router.get('/increment-qr', (req, res) => incrementCounter(req, res, 'qrClickCount'));
router.get('/check-qr-clicks', (req, res) => getCounter(req, res, 'qrClickCount'));
router.get('/increment-visits', (req, res) => incrementCounter(req, res, 'visits'));
router.get('/check-visits', (req, res) => getCounter(req, res, 'visits'));

module.exports = router;
