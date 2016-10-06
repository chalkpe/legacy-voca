const async = require('async');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

const Result = require('./Result');
const WeeklyTestResult = require('./WeeklyTestResult');

const schema = mongoose.Schema({
    email: { type: String, unique: true }, password: String,
    grade: Number, class: Number, number: Number, name: String,
    subscribe: Boolean, admin: Boolean
});

schema.statics.hash = (password) => bcrypt.hashSync(password);
schema.methods.check = function(password){
    return bcrypt.compareSync(password, this.password);
};

schema.methods.getAllResults = function(cb){
    async.parallel([
        cb => Result.findByUserId(this._id, cb),
        cb => WeeklyTestResult.findByUserId(this._id, cb),
    ], (err, results) => {
        if(err) return cb(err);
        cb(null, { exams: results[0], weeklyTests: results[1] });
    });
};

module.exports = mongoose.model('User', schema);
