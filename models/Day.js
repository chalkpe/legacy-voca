const mongoose = require('mongoose');

const schema = mongoose.Schema({
    book: String, day: Number,
    words: [{ word: String, meaning: String, level: Number }]
});

schema.statics.middleware = function(here, cb){
    return (req, res, next) => this.findOne({ book: req.params.book, day: req.params.day }, (err, day) => {
        if(err) return next(err);
        if(!day) return next();

        cb(req, res, next, here, day);
    });
};

schema.index({ book: 1, day: 1 }, { unique: true });

module.exports = mongoose.model('Day', schema);
