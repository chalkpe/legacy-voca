var request = require('request');
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/voca';
var pattern = /wordInput\('(.*)','(.*)',(.*)\);/;
var userAgent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';

MongoClient.connect(url, (err, db) => {
    if(err) return console.error(err);
    console.log("Connected!");

    let days = db.collection('days');
    for(let day = 1; day <= 60; day++) crawl(days, day);
});

function crawl(days, day){
    console.log('start:', day);

    let options = {
        headers: { 'User-Agent': userAgent },
        url: `http://voca.0pe.kr/learn_ok.php?a${day}=on&rate=100&rate_type=1&star=3&star_type=1`
    };

    request(options, (err, res, body) => {
        if(err) return console.error(err);
        let words = body.split('\n').map(line => line.match(pattern)).filter(Array.isArray).map(match => ({
            en: match[1], ko: match[2], level: match[3]
        }));

        days.update({ day }, { day, words }, { upsert: true }, (err, result) => {
            if(err) return console.error(err);
            console.log(`updated: ${day} (total ${result.result.n})`);
        });
    });
}
