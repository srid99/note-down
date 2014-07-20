var express = require('express');
var http = require('http');
var path = require('path');

var routes = require('./routes');
var fs = require('./lib/file');
var indexer = require('./lib/indexer');
var config = require('./lib/config');

var app = express();

var port = config.get('port');
var directories = config.get('directories');
var autoRelaod = config.get('auto-reload');
var devMode = config.get('dev-mode');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

app.use(function(err, req, res, next) {
	console.error("Error occured on proccessing the request.", err.stack);
    res.status(err.status || 500);
    res.render('error', {
        error: err,
        showStacktrace: devMode
    });
});

app.get("/*", routes.interceptor);

app.get('/', routes.home);
app.get('/s', routes.search);
app.get('/n', routes.note);

directories.forEach(function(dir) {
    if (!fs.fileExists(dir)) {
        throw new Error('The configured directory [ ' + dir + ' ] doesn\'t exist in the file system.');
    }

    indexer.startIndexing(dir, {
        monitor: autoRelaod
    });
});

http.createServer(app).listen(port, function() {
    console.log('Auto reload set to ' + autoRelaod);
    console.log('Express server listening on port ' + port);
});
