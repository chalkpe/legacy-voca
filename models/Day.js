const mongoose = require('mongoose');

const schema = mongoose.Schema({
    book: String, id: Number,
    words: [{ id: String, meaning: String, level: Number }]
});

schema.statics.middleware = function(here, cb){
    return (req, res, next) => this.findOne({ book: req.params.book, id: req.params.day }, (err, day) => {
        if(err) return next(err);
        if(!day) return next();

        cb(req, res, next, here, day);
    });
};

schema.index({ book: 1, id: 1 }, { unique: true });
module.exports = mongoose.model('Day', schema);
