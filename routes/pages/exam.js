const Day = require('../../models/Day');
const shuffle = require('shuffle-array');

const wordsPerDay = 10;
const optionsPerWord = 5;

function renderExamination(req, res, next, here, day){
    let words = shuffle.pick(day.words, { picks: Math.min(wordsPerDay, day.words.length) });

    words.forEach(word => {
        let otherWords = day.words.filter(w => w.meaning != word.meaning);
        let wrongWords = shuffle.pick(otherWords, { picks: Math.min(optionsPerWord - 1, otherWords.length) });

        word.options = shuffle([word, ...wrongWords]);
    });

    res.render('pages/exam', { here, book: day.book, day: day.day, words });
}

function handleExamination(req, res, next, here, day){
    let minCount = Math.min(wordsPerDay, day.words.length);
    if(Object.keys(req.body).length < minCount){
        req.flash('message', 'Please fill out all fields');
        res.redirect(`/exam/${day.book}/${day.day}`);
        return;
    }

    let words = new Map(day.words.map(word => [word.word, word.meaning]));
    if(Object.keys(req.body).some(word => {
        let meaning = req.body[word];

        let theWord = words.get(word);
        if(!theWord){
            req.flash('message', `Invalid word '${word}'`);
            return true;
        }

        if(meaning !== theWord.meaning){
            req.flash('message', `Incorrect answer on '${word}'`);
            return true;
        }
    })) return res.redirect(`/exam/${day.book}/${day.day}`);

    res.redirect();
}

function flashMessage(req, res, next){
    res.locals.message = req.flash('message');
    next();
}

function isAuthenticated(req, res, next){
    if(!req.isAuthenticated()) return res.redirect('/sign-in');
    next();
}

module.exports = (app) => {
    app.get('/exam/:book/:day', isAuthenticated, flashMessage, Day.middleware('/exam', renderExamination));
    app.post('/exam/:book/:day', isAuthenticated, Day.middleware('/exam', handleExamination));
};
