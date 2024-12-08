const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_SECRET_KEY, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connexion à MongoDB réussie !');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB :', error);
        process.exit(1);
    }
};

module.exports = connectDB;
