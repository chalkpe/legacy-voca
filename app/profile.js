const Result = require('../models/Result');

function getResults(req, res, next, books){
    let r = Object.assign(...books.map(book => ({ [book.id]: [] })));

    Result.findByUserId(req.user._id, (err, results) => {
        if(err) return next(err);
        res.locals.results = Object.assign(r, results); next();
    });
}

module.exports = {
    getResults
};
