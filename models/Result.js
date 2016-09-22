const mongoose = require('mongoose');

const schema = mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    book: String, day: Number, score: Number
});

schema.index({ user: 1, book: 1, day: 1 });
module.exports = mongoose.model('Result', schema);
