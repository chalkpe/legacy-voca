var vocaPackage = require('../package.json');

var Day = require('../models/Day');
var Book = require('../models/Book');

function isAuthenticated(req, res, next){
   if(req.isAuthenticated()) return next();
   res.redirect('/');
}

module.exports = (app, passport) => {
    const developing = app.get('env') === 'development';

    app.get('/', (req, res) => res.render('pages/home', { message: req.flash('message'), vocaPackage }));
    app.post('/', passport.authenticate('sign-up', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
    }));

    app.get('/sign-in', (req, res) => res.render('pages/sign-in', { message: req.flash('message') }));
    app.post('/sign-in', passport.authenticate('sign-in', {
        successRedirect: '/profile',
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
