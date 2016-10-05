const Day = require('../../models/Day');
const Book = require('../../models/Book');

function renderLearning(req, res, next, here, day){
    res.render('pages/learning', { here, day });
}

module.exports = (app, common) => {
    app.get('/learn/:book/:day', Day.middleware('/learn', renderLearning));
    app.get('/learn/:book',      Book.middleware('/learn', common.renderBook));
    app.get('/learn',            Book.middleware('/learn', common.renderBooks));
};
