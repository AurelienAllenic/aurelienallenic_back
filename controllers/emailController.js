
const sendEmail = require('../config/mailer');

const handleEmail = async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await sendEmail(email, `Contact form submission from ${name}`, message);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
        res.status(500).json({ success: false });
    }
};

module.exports = { handleEmail };
