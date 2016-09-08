const Book = require('../models/Book');
const exam = require('./pages/exam');
const learn = require('./pages/learn');

function renderBooks(req, res, next, here, books){
    res.render('pages/books', { here, books });
}

function renderBook(req, res, next, here, book){
    res.render('pages/book', { here, book: book.id, count: book.count });
}

module.exports = (app) => {
    exam(app); learn(app);

    app.get('/learn/:book', Book.middleware('/learn', renderBook));
    app.get('/exam/:book',  Book.middleware('/exam',  renderBook));

    app.get('/learn', Book.middleware('/learn', renderBooks));
    app.get('/exam',  Book.middleware('/exam',  renderBooks));
};
