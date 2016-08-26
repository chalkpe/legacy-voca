var mongoose = require('mongoose');

var schema = mongoose.Schema({
    book: String,
    day: Number,
    words: [{
        word: String,
        meaning: String,
        level: Number
    }]
});

schema.index({ book: 1, day: 1 }, { unique: true });
module.exports = mongoose.model('Day', schema);
