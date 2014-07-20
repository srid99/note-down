var express = require('express');
var http = require('http');
var path = require('path');

var routes = require('./routes');
var indexer = require('./lib/indexer');
var config = require('./lib/config');

var app = express();

var port = config.get('port');
var directories = config.get('directories');
var autoRelaod = config.get('auto-reload');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

app.get("/*", routes.interceptor);

app.get('/', routes.home);
app.get('/s', routes.search);
app.get('/n', routes.note);

directories.forEach(function(dir) {
    indexer.startIndexing(dir, {
        monitor: autoRelaod
    });
});

http.createServer(app).listen(port, function() {
    console.log('Auto reload set to ' + autoRelaod);
    console.log('Express server listening on port ' + port);
});
