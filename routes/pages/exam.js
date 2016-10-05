const Day = require('../../models/Day');
const Book = require('../../models/Book');

const exam = require('../../app/exam');

function renderExam(req, res, next, here, day){
    res.render('pages/exam', {
        here, book: day.book, day: day.id,
        words: exam.pickWords(day), magic: 'magic' in req.query
    });
}

module.exports = (app, common) => {
    app.get('/exam-result',      common.isAuthenticated, common.flash('result'), exam.handleResult);
    app.post('/exam/:book/:day', common.isAuthenticated, Day.middleware('/exam', exam.handleExam));

    app.get('/exam/:book/:day', common.isAuthenticated, common.flash('message'), Day.middleware('/exam', renderExam));
    app.get('/exam/:book',      common.isAuthenticated, Book.middleware('/exam', common.renderBook));
    app.get('/exam',            common.isAuthenticated, Book.middleware('/exam', common.renderBooks));
};
