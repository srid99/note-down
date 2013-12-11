var fs = require('fs');

exports.readFile = function(file) {
    return fs.readFileSync(file, 'utf8');
};
