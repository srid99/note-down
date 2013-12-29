var express = require('express');
var http = require('http');
var path = require('path');

var routes = require('./routes');
var indexer = require('./lib/indexer');

var app = express();

var noteDir = path.join(__dirname, 'notes');

app.set('port', process.env.PORT || 4001);
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

indexer.startIndexing(noteDir, {
    monitor: true
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
