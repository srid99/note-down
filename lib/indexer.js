var watch = require('watch');
var lunr = require('lunr');
var path = require('path');
var crypto = require('crypto');

var fs = require('./file');

var index = new lunr(function() {
    this.ref('id');
    this.field('title');
    this.field('body');
});

var store = new lunr.Store();

generateId = function(data) {
    var md5sum = crypto.createHash('md5');
    return md5sum.update(data).digest('hex');
};

markdown = function(file) {
    return /\.md$/.test(file);
};

addToIndex = function(file) {
    if (!markdown(file)) {
        return;
    }

    var id = generateId(file);
    var title = /[^/]*$/.exec(file)[0];
    var content = fs.readFile(file);

    index.add({
        id: id,
        title: title,
        body: content
    });

    store.set(id, {
        'file': file,
        'title': title
    });
};

monitor = function(dir) {
    watch.createMonitor(dir, function(monitor) {
        monitor.on('created', function(file, stat) {
            addToIndex(file);
        });
        monitor.on('changed', function(file, curr, prev) {
            // TODO update the index when a note is modified
        });
        monitor.on('removed', function(file, stat) {
            // TODO update the index when a note is removed
        });
    });
};

exports.startIndexing = function(dir, monitor) {
    watch.walk(dir, function(err, files) {
        for (file in files) {
            addToIndex(file);
        }
    });

    if (monitor) {
        monitor(dir);
    }
};

exports.search = function(term) {
    var items = index.search(term);
    var results = [];

    items.forEach(function(item) {
        var id = item.ref;
        results.push({
            id: id,
            title: store.get(id).title
        });
    });

    return results;
};

exports.get = function(id) {
    var result = store.get(id);
    if (result) {
        return result.file;
    }
    return;
};
