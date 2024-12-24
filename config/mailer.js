const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    seucre: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass : process.env.SMTP_PASSWORD,
    },
    port: 465,
    host: "smtp.gmail.com",
});

const sendEmail = async (to, subject, text) => {
    console.log(`${to}, ${subject}, ${text}`);
    console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD);
    const mailOptions = { from: process.env.SMTP_EMAIL, to, subject, text };
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
