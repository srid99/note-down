var marked = require('marked');

var indexer = require('../lib/indexer');
var fs = require('../lib/file');

exports.interceptor = function(req, res, next) {
    if (req.accepted[0].subtype === 'html') {
        res.locals.q = req.param('q');
    }

    next();
};

exports.home = function(req, res) {
    res.render('home');
};

exports.note = function(req, res) {
    var id = req.param('id');
    var file = indexer.get(id);
    var content = fs.readFile(file);
    res.render('note', {
        content: marked(content)
    });
};

exports.search = function(req, res) {
    var term = req.param('q');
    res.render('search', {
        items: indexer.search(term)
    });
};
