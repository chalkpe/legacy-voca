const async = require('async');
const mongoose = require('mongoose');
const WeeklyTest = require('./WeeklyTest');

const schema = mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    test: mongoose.Schema.Types.ObjectId, score: Number
});

schema.statics.findByUserId = function(userId, cb){
    this.find({ user: userId }, (err, results) => {
        if(err) return cb(err);

        async.each(results, (result, callback) => WeeklyTest.findById(result.test, (err, test) => {
            if(err) return callback(err);
            result.testObject = test; callback(null);
        }), (err) => {
            if(err) return cb(err);
            else cb(null, results);
        });
    });
};

schema.index({ user: 1, test: 1 });
module.exports = mongoose.model('WeeklyTestResult', schema);
