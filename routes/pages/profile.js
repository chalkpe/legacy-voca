const vocaPackage = require('../../package.json');

const Book = require('../../models/Book');
const Result = require('../../models/Result');

module.exports = Book.middleware('/', (req, res, next, here, books) => {
    res.locals.here = here;
    res.locals.books = books;
    res.locals.vocaPackage = vocaPackage;

    if(!req.isAuthenticated()) next();
    else Result.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: { book: '$book', day: '$day' }, count: { $sum: 1 } } },
        { $sort: { '_id.book': 1, '_id.day': 1 } }
    ], (err, results) => {
        if(err) return next(err);

        let r = { total: results.length };
        books.forEach(book => r[book.id] = []);
        results.forEach(result => r[result.book].push(result));

        res.locals.results = r;
        next();
    });
});
