var vocaPackage = require('../package.json');

var Day = require('../models/Day');
var Book = require('../models/Book');

module.exports = (app, passport) => {
    const developing = app.get('env') === 'development';

    function isAuthenticated(req, res, next){
        if(req.isAuthenticated()) return next();
        res.redirect('/');
    }

    function flash(req, res, next){
        res.locals.message = req.flash('message');
        next();
    }

    app.use((req, res, next) => {
        res.locals.user = req.user;
        res.locals.title = app.get('title');
        next();
    });

    app.get('/', flash, (req, res) => res.render('pages/home', { vocaPackage }));
    app.post('/', passport.authenticate('sign-up', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }));

    app.get('/sign-in', flash, (req, res) => res.render('pages/sign-in'));
    app.post('/sign-in', passport.authenticate('sign-in', {
        successRedirect: '/',
        failureRedirect: '/sign-in',
        failureFlash: true
    }));

    app.get('/sign-out', (req, res) => {
        req.logout();
        res.redirect('/');
    });

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
