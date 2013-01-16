/*
 * GET home page.
 */

 ea = require('eatings');

 module.exports = function(req, res) {
  ea.get(function(eatings) {
    var people = ea.names.map(function(name) {
      return ea.single(eatings, name);
    });

    res.setHeader('Access-Control-Allow-Origin', 'https://gist.github.com');
    res.render('dashboard/index', { title: 'Dashboard', eatings: eatings, people: people});
  });
};