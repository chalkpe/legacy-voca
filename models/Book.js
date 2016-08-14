var mongoose = require('mongoose');

module.exports = mongoose.model('Book', mongoose.Schema({
    id: String, name: String, image: String
}));
