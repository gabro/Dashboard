/*
 * GET eatings/update-client.
 */

var ea = require('eatings'),
  people = {},
  self = undefined;

module.exports = function(req, res) {
  self = req.params.name;
  ea.get(function(eatings) {
    var people = ea.names.map(function(name) {
      return ea.single(eatings, name, self);
    });

    var params = {
      title: 'Update Eatings',
      people: people,
      selfName: self
    };
    res.render('eatings/update', params);
  });
};