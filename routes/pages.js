const Day = require('../models/Day');
const Book = require('../models/Book');

function findBooks(here){
    return (req, res, next) => Book.find().sort('id').exec((err, books) => {
        if(err) return next(err);
        if(!books || !books.length) return next();

        res.render('pages/books', { here, books });
    });
}

function findDays(here){
    return (req, res, next) => Day.count({ book: req.params.book }, (err, count) => {
        if(err) return next(err);
        if(!count) return next();

        res.render('pages/days', { here, book: req.params.book, count });
    });
}

function findDay(here){
    return (req, res, next) => Day.findOne({ book: req.params.book, day: req.params.day }, (err, day) => {
        if(err) return next(err);
        if(!day) return next();

        res.render('pages/day', { here, words: day.words });
    });
}

module.exports = (app) => {
    app.get('/learn/:book/:day', findDay('/learn'));
    app.get('/learn/:book', findDays('/learn'));
    app.get('/learn', findBooks('/learn'));

    app.get('/exam/:book/:day', findDay('/exam'));
    app.get('/exam/:book', findDays('/exam'));
    app.get('/exam', findBooks('/exam'));
};
