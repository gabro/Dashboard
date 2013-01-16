var http = require("http");
var parser = require('xml2json');

exports.ctaJSON = function(cb, busNo, stopId, maxResults) {
    var prot = http;
    var apiKey = "NLAQqgV9tfMYgFkHvnELZFczk";
    var host = "www.ctabustracker.com";
    var path = "/bustime/api/v1/getpredictions?key="+apiKey+"&stpid="+stopId+"&rt="+busNo;
    if (maxResults !== undefined)
        path += "&top="+maxResults;

    var options = {
        host: host,
        path: path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/xml'
        }
    };

    var req = prot.request(options, function(res) {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
          var json = parser.toJson(output); //returns a string containing the JSON structure by default
          cb(json);
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};