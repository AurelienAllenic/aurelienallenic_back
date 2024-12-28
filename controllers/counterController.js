const Counter = require('../models/Counter');

const incrementCounter = async (req, res, nameNotFromParams) => {
    const name = nameNotFromParams || req.params.name;

    try {
        const counter = await Counter.findOneAndUpdate(
            { name },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );
        res.status(200).json({ success: true, count: counter.count });
    } catch (error) {
        console.error(`Erreur lors de l'incrémentation (${name}):`, error);
        res.status(500).json({ success: false });
    }
};


const getCounter = async (req, res, nameNotFromParams) => {
    const name = nameNotFromParams || req.params.name;

    try {
        const counter = await Counter.findOne({ name }) || { count: 0 };
        res.status(200).json({ count: counter.count });
    } catch (error) {
        console.error(`Erreur lors de la récupération (${name}):`, error);
        res.status(500).json({ success: false });
    }
};

module.exports = { incrementCounter, getCounter };
