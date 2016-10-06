const moment = require('moment');
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    book: String, day: Number, score: Number
});

schema.statics.findByUserId = function(userId, cb){
    this.aggregate([
        { $match: { user: userId } },
        { $group: { _id: { book: '$book', day: '$day' }, count: { $sum: 1 }, ids: { $push: '$_id' } } },
        { $group: { _id: '$_id.book', days: { $push: { day: '$_id.day', count: '$count', ids: '$ids' } } } }
    ], (err, results) => {
        if(err) return cb(err);

        let niceResults = {};
        results.forEach(result => {
            niceResults[result._id] = result.days;
            niceResults[result._id].sort((a, b) => a.day - b.day);
            niceResults[result._id].forEach(day => day.dates = day.ids.map(id => moment(id.getTimestamp()).format('YYYY-MM-DD HH:mm:ss')).sort());
        });

        cb(null, niceResults);
    });
};

schema.index({ user: 1, book: 1, day: 1 });
module.exports = mongoose.model('Result', schema);
