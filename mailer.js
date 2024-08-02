// ./back/mailer.js
require('dotenv').config();
const nodemailer = require('nodemailer');

// Configurez le transporteur SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail', // Assurez-vous que c'est le service approprié ou utilisez un autre service SMTP
    auth: {
        user: process.env.SMTP_EMAIL, // Assurez-vous que cette variable d'environnement est correctement définie
        pass: process.env.SMTP_PASSWORD, // Assurez-vous que cette variable d'environnement est correctement définie
    },
    tls: {
        rejectUnauthorized: false // Ignore les erreurs liées aux certificats auto-signés
    }
});

// Fonction pour envoyer un email
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.SMTP_EMAIL, // Assurez-vous que cette variable d'environnement est correctement définie
        to,
        subject,
        text
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
