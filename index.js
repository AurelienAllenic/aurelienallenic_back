const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sendEmail } = require('./mailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000; // Utiliser la variable d'environnement PORT ou 3000 par défaut

// Initialisation du compteur pour les clics sur le QR code
let qrClickCount = 0;

app.use(cors({
    origin: ['https://aurelienallenic.fr', 'http://localhost:5173', 'http://localhost:5174', "https://paro-officiel.com", "https://paro-musique.com"],
}));
app.use(bodyParser.json()); // Utilisez bodyParser pour analyser le corps des requêtes JSON

app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        await sendEmail(email, `Contact form submission from ${name}`, message);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false });
    }
});


app.get('/increment-qr', (req, res) => {
    qrClickCount++;
    console.log(`QR code clicked ${qrClickCount} times`);
    res.status(200).json({ success: true, clickCount: qrClickCount });
});

app.get('/check-qr-clicks', (req, res) => {
    res.status(200).json({ clickCount: qrClickCount });
});

app.get('/increment-visits', (req, res) => {
    visits++;
    console.log(`site visited ${visits} times`);
    res.status(200).json({ success: true, visits: visits });
});

app.get('/check-visits', (req, res) => {
    res.status(200).json({ visits: visits });
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});

