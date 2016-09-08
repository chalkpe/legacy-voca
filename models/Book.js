const mongoose = require('mongoose');

const schema = mongoose.Schema({
    id: { type: String, unique: true }, name: String, count: Number, image: String
});

schema.statics.middleware = function(here, cb){
    return (req, res, next) => {
        if(req.params && req.params.book) return this.findOne({ id: req.params.book }, (err, book) => {
            if(err) return next(err);
            if(!book) return next();

            cb(req, res, next, here, book);
        });

        else return this.find().sort('id').exec((err, books) => {
            if(err) return next(err);
            if(!books || !books.length) return next();

            cb(req, res, next, here, books);
        });
    };
};

module.exports = mongoose.model('Book', schema);
