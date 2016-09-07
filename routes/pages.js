const shuffle = require('shuffle-array');

const Day = require('../models/Day');
const Book = require('../models/Book');

function findBooks(here, cb){
    return (req, res, next) => Book.find().sort('id').exec((err, books) => {
        if(err) return next(err);
        if(!books || !books.length) return next();

        cb(req, res, next, here, books);
    });
}

function findDays(here, cb){
    return (req, res, next) => Day.count({ book: req.params.book }, (err, count) => {
        if(err) return next(err);
        if(!count) return next();

        cb(req, res, next, here, count);
    });
}

function findDay(here, cb){
    return (req, res, next) => Day.findOne({ book: req.params.book, day: req.params.day }, (err, day) => {
        if(err) return next(err);
        if(!day) return next();

        cb(req, res, next, here, day);
    });
}

function renderBooks(req, res, next, here, books){
    res.render('pages/books', { here, books });
}

function renderDays(req, res, next, here, count){
    res.render('pages/days', { here, book: req.params.book, count });
}

function renderLearning(req, res, next, here, day){
    res.render('pages/learning', { here, words: day.words });
}

function renderExamination(req, res, next, here, day){
    let words = shuffle.pick(day.words, { picks: Math.min(10, day.words.length) });

    words.forEach(word => {
        let otherWords = day.words.filter(w => w.meaning != word.meaning);
        let wrongWords = shuffle.pick(otherWords, { picks: Math.min(4, otherWords.length) });

        word.options = shuffle([word, ...wrongWords]);
    });

    res.render('pages/exam', { here, book: day.book, day: day.day, words });
}

module.exports = (app) => {
    app.get('/learn/:book/:day', findDay('/learn', renderLearning));
    app.get('/learn/:book',      findDays('/learn', renderDays));
    app.get('/learn',            findBooks('/learn', renderBooks));

    app.get('/exam/:book/:day', findDay('/exam', renderExamination));
    app.get('/exam/:book',      findDays('/exam', renderDays));
    app.get('/exam',            findBooks('/exam', renderBooks));
};
