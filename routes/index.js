module.exports = (app, vocaPackage, db) => {
    app.get('/', (req, res) => res.render('pages/home', { version: vocaPackage.version }));

    app.get('/learn/:book/:day', (req, res, next) => db.collection('days_' + req.params.book, (err, col) => {
        if(err) return next(err);
        if(!col) return next();

        col.findOne({ _id: parseInt(req.params.day, 10) }, (err, day) => {
            if(err) return next(err);
            if(!day) return next();

            res.render('pages/learning', { words: day.words });
        });
    }));

    app.get('/learn/:book', (req, res, next) => db.collection('days_' + req.params.book, (err, col) => {
        if(err) return next(err);
        if(!col) return next();

        col.count({}, (err, count) => {
            if(err) return next(err);
            res.render('pages/days', { book: req.params.book, count });
        });
    }));

    app.get('/learn', (req, res) => db.collection('books', (err, col) => {
        if(err) return next(err);
        if(!col) return next();

        col.find().toArray((err, books) => {
            if(err) return next(err);
            if(!books) return next();

            res.render('pages/learn', { books });
        });
    }));
    app.get('/exam',     (req, res) => res.render('pages/exam'));
    app.get('/download', (req, res) => res.render('pages/download'));
};
