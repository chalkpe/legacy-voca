const json2csv = require('json2csv');

const Day = require('../../models/Day');
const Book = require('../../models/Book');

const fields = ['id', 'meaning', 'level'];
const fieldNames = ['Word', 'Meaning', 'Level'];

module.exports = (app, functions) => {
    app.get('/download/:book/:day', Day.middleware('/download', (req, res, next, here, day) => {
        res.attachment(`voca-${day.book}-${day.id}.csv`);
        res.status(200).send(json2csv({ data: day.words, fields, fieldNames }));
    }));

    app.get('/download/:book', Book.middleware('/download', functions.renderBook));
    app.get('/download',       Book.middleware('/download', functions.renderBooks));
};
