const mongoose = require('mongoose');

const RadioSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    date: { type: String, required: true, unique: true },
    image: { type: String, required: false },
    guestsList: { type: String, required: true },
    firstVideo: { type: String, required: false },
    secondVideo: { type: String, required: false },
    thirdVideo: { type: String, required: false },
    id: { type: String, unique: true }
});

module.exports = mongoose.model('Radio', RadioSchema);
