const shuffle = require('shuffle-array');

const Result = require('../models/Result');
const WeeklyTest = require('../models/WeeklyTest');

const examOption = {
    totalWords: 10,
    optionsPerWord: 5
};

const weeklyTestOption = {
    totalWords: 50,
    optionsPerWord: 5
};

function pickWords(list, options){
    let words = shuffle.pick(list, { picks: Math.min(options.totalWords, list.length) });

    words.forEach(word => {
        let otherWords = list.filter(w => w.meaning != word.meaning);
        let wrongWords = shuffle.pick(otherWords, { picks: Math.min(options.optionsPerWord - 1, otherWords.length) });

        word.options = shuffle([word, ...wrongWords]);
    });

    return words;
}

function handleBook(req, res, next, here, book){
    WeeklyTest.findAvailable(book.id, new Date(), (err, test) => {
        res.render('pages/book', { here, book, test: test || null });
    });
}

function createExam(req, res, next, here, day){
    let words = pickWords(day.words, examOption);
    res.render('pages/exam', { here, book: day.book, day: day.id, words });
}

// FIXME: Not working with weekly test
function handleExam(req, res, next, here, day){
    let answeredWords = req.body;
    let minWordCount = Math.min(examOption.totalWords, day.words.length);

    let answeredWordIds = Object.keys(answeredWords);
    if(answeredWordIds.length < minWordCount){
        req.flash('message', 'Please fill out all fields');
        res.redirect(`/exam/${day.book}/${day.id}`);
        return;
    }

    let vocabulary = new Map(day.words.map(word => [word.id, word.meaning]));
    let wrongWords = [];

    if(answeredWordIds.some(wordId => {
        if(!vocabulary.has(wordId)){
            req.flash('message', `Invalid word '${wordId}'`);
            return true;
        }

        let answredMeaning = answeredWords[wordId];
        let correctMeaning = vocabulary.get(wordId);

        if(answredMeaning !== correctMeaning) wrongWords.push({ id: wordId, correct: correctMeaning, answered: answredMeaning });
    })) return res.redirect(`/exam/${day.book}/${day.id}`);

    let finish = () => {
        req.flash('result', { day, right: !wrongWords.length, wrongWords });
        res.redirect('/exam-result');
    };

    if(wrongWords.length) finish();
    else new Result({ user: req.user._id, book: day.book, day: day.id, score: answeredWordIds.length }).save(err => err ? next(err) : finish());
}

function handleWeeklyTest(req, res, next, here, book){
    WeeklyTest.findAvailable(book.id, new Date(), (err, test) => {
        if(err) return next(err);
        if(!test) return next(null);

        let list = [].concat(...test.dayObjects.map(day => day.words));
        let words = pickWords(list, weeklyTestOption);

        // TODO: Make weekly test page independent
        res.render('pages/exam', {
            here, book: book.id, day: 'weekly-test', words
        });
    });
}

module.exports = {
    createExam,
    handleBook,
    handleExam,
    handleWeeklyTest
};
