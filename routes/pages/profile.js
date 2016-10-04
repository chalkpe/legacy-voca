const vocaPackage = require('../../package.json');

const Book = require('../../models/Book');
const profile = require('../../app/profile');

module.exports = Book.middleware('/', (req, res, next, here, books) => {
    res.locals.here = here;
    res.locals.books = books;
    res.locals.vocaPackage = vocaPackage;

    if(!req.isAuthenticated()) next();
    else profile.getResults(req, res, next, books);
});
