var mongoose = require('mongoose');

module.exports = mongoose.model('Book', mongoose.Schema({
    id: { type: String, unique: true }, name: String, image: String
}));
