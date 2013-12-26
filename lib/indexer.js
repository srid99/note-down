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

updateIndex = function(file) {
    removeFromIndex(file);
    addToIndex(file);
};

removeFromIndex = function(file) {
    var id = generateId(file);

    index.remove({
        id: id
    });

    store.remove(id);
};

monitor = function(dir) {
    watch.createMonitor(dir, function(monitor) {
        monitor.on('created', function(file, stat) {
            addToIndex(file);
        });
        monitor.on('changed', function(file, curr, prev) {
            updateIndex(file)
        });
        monitor.on('removed', function(file, stat) {
            removeFromIndex(file);
        });
    });
};

exports.startIndexing = function(dir, options) {
    watch.walk(dir, function(err, files) {
        for (file in files) {
            addToIndex(file);
        }
    });

    if (!options) {
        return;
    }

    if (options.monitor) {
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
