const mongoose = require('mongoose');

const RadioSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    date: { type: String, required: true, unique: true },
    guestsList: { type: String, required: true },
    firstVideo: { type: String, required: true },
    secondVideo: { type: String, required: false },
    thirdVideo: { type: String, required: false },
    id: { type: String, unique: true }
});

module.exports = mongoose.model('Radio', RadioSchema);
