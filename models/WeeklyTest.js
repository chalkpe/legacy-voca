const async = require('async');
const mongoose = require('mongoose');

const Day = require('./Day');

const schema = mongoose.Schema({
    from: Date, until: Date, book: String, days: [Number]
});

schema.statics.findAvailable = function(book, date, callback){
    this.findOne({ from: { $lte: date }, until: { $gte: date }, book: book.id }, (err, test) => {
        if(err) return callback(err);
        if(!test) return callback(null);

        async.map(test.days, (day, cb) => Day.findOne({ id: day }, cb), (err, results) => {
            if(err) return callback(err);

            test.dayObjects = results;
            callback(null, test);
        });
    });
};

schema.index({ from: 1, until: 1, book: 1 });
module.exports = mongoose.model('WeeklyTest', schema);
