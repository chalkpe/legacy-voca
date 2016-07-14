var os = require('os');
var path = require('path');
var cluster = require('cluster');
var express = require('express');

var vocaPackage = require('./package.json');

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

    require('./routes')(app, vocaPackage);

    app.listen(8080, () => console.log(`Listening on worker #${id}`))
}
