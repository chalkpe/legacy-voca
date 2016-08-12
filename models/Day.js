var mongoose = require('mongoose');

module.exports = mongoose.model('Day', mongoose.Schema({
    book: String,
    day: Number,
    words: [{
        word: String,
        meaning: String,
        level: Number
    }]
}));
