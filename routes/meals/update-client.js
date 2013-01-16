/*
 * GET meals/update-client.
 */

var ea = require('meals'),
  people = {},
  self = undefined;

module.exports = function(req, res) {
  self = req.params.name;
  ea.get(function(meals) {
    var people = ea.names.map(function(name) {
      return ea.single(meals, name, self);
    });

    var params = {
      title: 'Update Meals',
      people: people,
      selfName: self
    };
    res.render('meals/update', params);
  });
};