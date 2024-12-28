const mongoose = require('mongoose');

const SmartLinkSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    linkType: { type: String, required: true },
    titleType: { type: String, required: true },
    modifiedTitle: { type: String, required: true, unique: true },
    link: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('SmartLink', SmartLinkSchema);
