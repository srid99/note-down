var fs = require('fs');

exports.readFile = function(file) {
    return fs.readFileSync(file, 'utf8');
};

exports.fileExists = function(file) {
    return fs.existsSync(file);
}
