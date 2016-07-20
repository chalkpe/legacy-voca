

module.exports = (app, vocaPackage, db) => {
    let days = db.collection('days_wmr');

    app.get('/',         (req, res) => res.render('home', { version: vocaPackage.version }));

    app.get('/learn/:day', (req, res) => days.findOne({ _id: req.params.day }, (err, day) => res.render('day', { words: day.words })));
    app.get('/learn',      (req, res) => res.render('learn', { book: 'wmr' }));

    app.get('/exam',     (req, res) => res.render('exam'));
    app.get('/download', (req, res) => res.render('download'));
};
