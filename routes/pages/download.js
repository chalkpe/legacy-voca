const json2csv = require('json2csv');

const Day = require('../../models/Day');
const Book = require('../../models/Book');

const fields = ['id', 'meaning', 'level'];
const fieldNames = ['Word', 'Meaning', 'Level'];

function exportDay(req, res, next, here, day){
    res.attachment(`voca-${day.book}-${day.id}.csv`);
    res.status(200).send(json2csv({ data: day.words, fields, fieldNames }));
}

module.exports = (app, common) => {
    app.get('/download/:book/:day', Day.middleware('/download', exportDay));
    app.get('/download/:book',      Book.middleware('/download', common.renderBook));
    app.get('/download',            Book.middleware('/download', common.renderBooks));
};
