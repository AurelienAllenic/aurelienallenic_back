const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuration de Mongoose pour MongoDB
mongoose.connect(process.env.MONGO_SECRET_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.error('Erreur de connexion à MongoDB :', error));

// Modèle pour les compteurs
const CounterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', CounterSchema);

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Votre email
        pass: process.env.EMAIL_PASS, // Mot de passe ou token d'application
    },
});

// Fonction pour envoyer des emails
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    await transporter.sendMail(mailOptions);
};

// Configuration du rate limiter
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 15,
    message: "Vous avez atteint la limite d'appels pour cette heure.",
    keyGenerator: (req) => req.ip, // Utilise l'IP comme clé pour chaque utilisateur
});

// Appliquer le rate limiter à toutes les routes
app.use(limiter);

// Configuration CORS
app.use(
    cors({
        origin: [
            'https://aurelienallenic.fr',
            'http://localhost:5173',
            'http://localhost:5174',
            'https://paro-officiel.com',
            'https://paro-musique.com',
        ],
        credentials: true, // Autoriser l'envoi de cookies
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Méthodes autorisées
        allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
    })
);

app.use(bodyParser.json());

// Endpoint pour envoyer des emails
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        await sendEmail(email, `Contact form submission from ${name}`, message);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
        res.status(500).json({ success: false });
    }
});

// Gestion des clics sur le QR code
app.get('/increment-qr', async (req, res) => {
    try {
        const counter = await Counter.findOneAndUpdate(
            { name: 'qrClickCount' },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );
        console.log(`QR code cliqué ${counter.count} fois.`);
        res.status(200).json({ success: true, clickCount: counter.count });
    } catch (error) {
        console.error('Erreur lors de l\'incrémentation du QR code :', error);
        res.status(500).json({ success: false });
    }
});

app.get('/check-qr-clicks', async (req, res) => {
    try {
        const counter = await Counter.findOne({ name: 'qrClickCount' }) || { count: 0 };
        res.status(200).json({ clickCount: counter.count });
    } catch (error) {
        console.error('Erreur lors de la récupération des clics QR code :', error);
        res.status(500).json({ success: false });
    }
});

// Gestion des visites sur le site
app.get('/increment-visits', async (req, res) => {
    try {
        const counter = await Counter.findOneAndUpdate(
            { name: 'visits' },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );
        console.log(`Site visité ${counter.count} fois.`);
        res.status(200).json({ success: true, visits: counter.count });
    } catch (error) {
        console.error('Erreur lors de l\'incrémentation des visites :', error);
        res.status(500).json({ success: false });
    }
});

app.get('/check-visits', async (req, res) => {
    try {
        const counter = await Counter.findOne({ name: 'visits' }) || { count: 0 };
        res.status(200).json({ visits: counter.count });
    } catch (error) {
        console.error('Erreur lors de la récupération des visites :', error);
        res.status(500).json({ success: false });
    }
});

// Route de base
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
