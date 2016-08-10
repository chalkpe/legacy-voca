module.exports = (app, vocaPackage, db) => {
    let col = db.collection('days_wmr');
    
    let count;
    col.count({}, (err, c) => count = c);
    

    app.get('/',         (req, res) => res.render('pages/home', { version: vocaPackage.version }));
    
    app.get('/learn/:day', (req, res) => col.findOne({ _id: parseInt(req.params.day, 10) }, (err, day) => res.render('pages/learning', { words: day.words })));
    app.get('/learn',      (req, res) => res.render('pages/learn', { book: 'wmr' }));

    app.get('/exam',     (req, res) => res.render('pages/exam'));
    app.get('/download', (req, res) => res.render('pages/download'));
};
