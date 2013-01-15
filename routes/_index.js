var fs = require('fs'),
    e = {},
    addRoute = function(file) {
        var parts = file.split('.'),
            route = parts.splice(0, parts.length - 1).join('.').replace(/\//g, '-');
        e[route] = require('./' + file);
    },
    addDirRoutes = function(dir) {
        fs.readdirSync('./routes/' + dir).forEach(function(file) {
            if (fs.statSync('./routes/' + dir + '/' + file).isDirectory()) addDirRoutes(dir + '/' + file);
            else if (!file.match(/\.json|^_/)) addRoute(dir + '/' + file);
        });
    };

fs.readdirSync('./routes').forEach(function(file) {
    if (fs.statSync('./routes/' + file).isDirectory()) addDirRoutes(file);
    else if (!file.match(/\.json|^_/)) addRoute(file);
});
module.exports = e;
