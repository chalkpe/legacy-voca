const shuffle = require('shuffle-array');
const Result = require('../models/Result');

const wordsPerDay = 10;
const optionsPerWord = 5;

function pickWords(day){
    let words = shuffle.pick(day.words, { picks: Math.min(wordsPerDay, day.words.length) });

    words.forEach(word => {
        let otherWords = day.words.filter(w => w.meaning != word.meaning);
        let wrongWords = shuffle.pick(otherWords, { picks: Math.min(optionsPerWord - 1, otherWords.length) });

        word.options = shuffle([word, ...wrongWords]);
    });

    return words;
}

function handleExam(req, res, next, here, day){
    let answeredWords = req.body;
    let minWordCount = Math.min(wordsPerDay, day.words.length);

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

        if(answredMeaning !== correctMeaning) wrongWords.push([wordId, correctMeaning, answredMeaning]);
    })) return res.redirect(`/exam/${day.book}/${day.id}`);

    if(!wrongWords.length) new Result({ user: req.user._id, book: day.book, day: day.id, score: answeredWordIds.length }).save();

    req.flash('result', { right: !wrongWords.length, wrongWords });
    res.redirect('/exam-result');
}

function handleResult(req, res, next){
    let result = req.flash('result');
    if(!result || !result.length){
        var err = new Error('Forbidden');
        err.status = 403; return next(err);
    }

    res.json(result);
    //TODO: Implement result page
}

module.exports = {
    pickWords,
    handleExam,
    handleResult
};