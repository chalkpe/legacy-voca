var os = require('os');
var path = require('path');
var cluster = require('cluster');
var express = require('express');

var vocaPackage = require('./package.json');
var MongoClient = require('mongodb').MongoClient;

if(cluster.isMaster){
    os.cpus().forEach(() => cluster.fork());
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker #${worker.id} died: ${signal || code}`);
        cluster.fork();
    });
}else{
    let id = cluster.worker.id;

    let app = express();
    app.set('view engine', 'pug');
    app.use(express.static(path.join(__dirname, 'static')));

    MongoClient.connect('mongodb://localhost:27017/voca', (err, db) => {
        if(err) return console.error(err);

        require('./routes')(app, vocaPackage, db);
        app.listen(8080, () => console.log(`Listening on worker #${id}`));
    });
}
