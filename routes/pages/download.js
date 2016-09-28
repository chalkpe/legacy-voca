const json2csv = require('json2csv');
const Day = require('../../models/Day');

const fields = ['id', 'meaning', 'level'];
const fieldNames = ['Word', 'Meaning', 'Level'];

module.exports = (app) => {
    app.get('/download/:book/:day', Day.middleware('/download', (req, res, next, here, day) => {
        res.attachment(`voca-${day.book}-${day.id}.csv`);
        res.status(200).send(json2csv({ data: day.words, fields, fieldNames }));
    }));
};
