var cluster = require('cluster');

if(cluster.isMaster){
    let os = require('os');

    os.cpus().forEach(() => cluster.fork());
    cluster.on('exit', (worker, code, signal) => {
        console.log(`#${worker.id}: died (${signal || code})`);
        cluster.fork();
    });

    return;
}

var id = cluster.worker.id;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/voca', { server: { auto_reconnect: true } });

var db = mongoose.connection;
db.on('open', () => console.log(`#${id}: Connected database ${db.name}`));
db.on('error', err => {
    console.error(err);
    process.exit(1);
});

var express = require('express');
var vocaPackage = require('./package.json');

var path = require('path');
var logger = require('morgan');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();
app.set('view engine', 'pug');
app.set('port', process.env.PORT || '8080');

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

require('./routes')(app);
app.listen(app.get('port'), () => console.log(`#${id}: Listening on port ${app.get('port')}`));
