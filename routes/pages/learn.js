const Day = require('../../models/Day');

function renderLearning(req, res, next, here, day){
    res.render('pages/learning', { here, day });
}

module.exports = (app) => {
    app.get('/learn/:book/:day', Day.middleware('/learn', renderLearning));
};
