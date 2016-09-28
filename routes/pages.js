const Book = require('../models/Book');

const exam = require('./pages/exam');
const learn = require('./pages/learn');
const download = require('./pages/download');

function renderBooks(req, res, next, here, books){
    res.render('pages/books', { here, books });
}

function renderBook(req, res, next, here, book){
    res.render('pages/book', { here, book });
}

function isAuthenticated(req, res, next){
    if(!req.isAuthenticated()) return res.redirect('/sign-in');
    next();
}

module.exports = (app) => {
    exam(app); learn(app); download(app);

    app.get('/learn/:book', Book.middleware('/learn', renderBook));
    app.get('/learn',       Book.middleware('/learn', renderBooks));

    app.get('/exam/:book', isAuthenticated, Book.middleware('/exam',  renderBook));
    app.get('/exam',       isAuthenticated, Book.middleware('/exam',  renderBooks));

    app.get('/download/:book', Book.middleware('/download',  renderBook));
    app.get('/download',       Book.middleware('/download',  renderBooks));
};
