const async = require('async');
const mongoose = require('mongoose');

const Day = require('./Day');

const schema = mongoose.Schema({
    from: Date, until: Date, book: String, days: [Number]
});

schema.statics.findAvailable = function(book, date, cb){
    this.findOne({ from: { $lte: date }, until: { $gte: date }, book: book.id }, (err, test) => {
        if(err) return cb(err);
        if(!test) return cb(null);

        async.map(test.days, (day, callback) => Day.findOne({ id: day }, callback), (err, results) => {
            if(err) return cb(err);

            test.dayObjects = results;
            cb(null, test);
        });
    });
};

schema.index({ from: 1, until: 1, book: 1 });
module.exports = mongoose.model('WeeklyTest', schema);
