function getResults(req, res, next, books){
    let r = Object.assign(...books.map(book => ({ [book.id]: [] })));

    req.user.getAllResults((err, results) => {
        if(err) return next(err);

        results.exams = Object.assign(r, results.exams);
        res.locals.results = results; next();
    });
}

module.exports = { getResults };
