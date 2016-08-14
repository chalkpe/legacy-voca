var vocaPackage = require('../package.json');

var Day = require('../models/Day');
var Book = require('../models/Book');

module.exports = (app) => {
    const developing = app.get('env') === 'development';

    app.get('/', (req, res) => res.render('pages/home', { version: vocaPackage.version }));

    app.get('/learn/:book/:day', (req, res, next) => Day.findOne({ book: req.params.book, day: req.params.day }, (err, day) => {
        if(err) return next(err); if(!day) return next();
        res.render('pages/learning', { words: day.words });
    }));

    app.get('/learn/:book', (req, res, next) => Day.count({ book: req.params.book }, (err, count) => {
        if(err) return next(err); if(!count) return next();
        res.render('pages/days', { book: req.params.book, count });
    }));

    app.get('/learn', (req, res, next) => Book.find().sort('id').exec((err, books) => {
        if(err) return next(err); if(!books || !books.length) return next();
        res.render('pages/learn', { books });
    }));

    app.get('/exam',     (req, res) => res.render('pages/exam'));
    app.get('/download', (req, res) => res.render('pages/download'));

    app.use((req, res, next) => {
        var err = new Error('Not Found');
        err.status = 404; next(err);
    });

    app.use(function(err, req, res, next){
        res.status(err.status || 500);
        res.render('error', {
            status: err.status,
            stack: developing && err.stack
        });
    });
};
