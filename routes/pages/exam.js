const Day = require('../../models/Day');
const exam = require('../../app/exam');

function isAuthenticated(req, res, next){
    if(!req.isAuthenticated()) return res.redirect('/sign-in');
    next();
}

function flash(key){
    return (req, res, next) => {
        res.locals[key] = req.flash(key);
        if(Array.isArray(res.locals[key])) res.locals[key] = res.locals[key][0];
        next();
    };
}

function renderExam(req, res, next, here, day){
    res.render('pages/exam', { here, book: day.book, day: day.id, words: exam.pickWords(day), magic: 'magic' in req.query });
}

module.exports = (app) => {
    app.get('/exam-result', isAuthenticated, flash('result'), exam.handleResult);

    app.get('/exam/:book/:day', isAuthenticated, flash('message'), Day.middleware('/exam', renderExam));
    app.post('/exam/:book/:day', isAuthenticated, Day.middleware('/exam', exam.handleExam));

};
