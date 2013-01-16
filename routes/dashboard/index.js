/*
 * GET home page.
 */

 ea = require('meals');

 module.exports = function(req, res) {
  ea.get(function(meals) {
    var people = ea.names.map(function(name) {
      return ea.single(meals, name);
    });

    res.setHeader('Access-Control-Allow-Origin', 'https://gist.github.com');
    res.render('dashboard/index', { title: 'Dashboard', meals: meals, people: people});
  });
};
