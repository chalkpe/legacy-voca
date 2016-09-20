const vocaPackage = require('../../package.json');

const Book = require('../../models/Book');
const Result = require('../../models/Result');

module.exports = Book.middleware('/', (req, res, next, here, books) => {
    res.locals.here = here;
    res.locals.books = books;
    res.locals.vocaPackage = vocaPackage;

    if(!req.isAuthenticated()) next();
    else Result.find({ user: req.user._id }, (err, results) => {
        if(err) return next(err);

        let r = {};
        books.forEach(book => r[book.id] = []);
        results.forEach(result => r[result.book].push(result));

        res.locals.results = r;
        next();
    });
});
