var fs = require('fs'),
    e = {},
    addMiddleware = function(file) {
        var parts = file.split('.'),
            route = parts.splice(0, parts.length - 1).join('.').replace(/\//g, '-');
        e[route] = require('./' + file);
    },
    addDirMiddleware = function(dir) {
        fs.readdirSync('./middleware/' + dir).forEach(function(file) {
            if (!file.match(/\.json|^_/)) addMiddleware(dir + '/' + file);   
        });
    };

fs.readdirSync('./middleware').forEach(function(file) {
    if (fs.statSync('./middleware/' + file).isDirectory()) addDirMiddleware(file);
    else if (!file.match(/\.json|^_/)) addMiddleware(file);
});
module.exports = e;
