const Day = require('../../models/Day');
const Book = require('../../models/Book');

const exam = require('../../app/exam');

function renderResult(req, res, next){
    if(!res.locals.result){
        var err = new Error('Forbidden');
        err.status = 403; return next(err);
    }

    res.render('pages/result');
}

module.exports = (app, common) => {
    app.get('/exam-result',      common.isAuthenticated, common.flash('result'), renderResult);

    app.get('/exam/:book/weekly-test', common.isAuthenticated, Book.middleware('/exam', exam.handleWeeklyTest));
    app.post('/exam/:book/weekly-test', common.isAuthenticated);

    app.get('/exam/:book/:day',  common.isAuthenticated, common.flash('message'), Day.middleware('/exam', exam.createExam));
    app.post('/exam/:book/:day', common.isAuthenticated, Day.middleware('/exam', exam.handleExam));

    app.get('/exam/:book',      common.isAuthenticated, Book.middleware('/exam', exam.handleBook));
    app.get('/exam',            common.isAuthenticated, Book.middleware('/exam', common.renderBooks));
};
