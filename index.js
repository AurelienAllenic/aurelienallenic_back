// ./back/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sendEmail } = require('./mailer');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173', // Remplacez par l'URL de votre front-end
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
