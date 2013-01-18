/*
 * GET meals/update-client.
 */

var ea = require('meals'),
  people = {},
  self = undefined;

module.exports = function(req, res) {
  self = req.params.name;
  ea.get(function(meals) {
    var person = ea.single(meals, self, self);

    var params = {
      title: 'Update Meals',
      person: person
    };
    res.render('meals/update', params);
  });
};