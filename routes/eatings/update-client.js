/*
 * GET eatings/update-client.
 */

var getEatings = require('eatings'),
  names = ['gio', 'luca', 'jaja', 'gabro', 'claudio', 'dani'],
  people = {},
  self = undefined;

function single(eatings, name, self) {
  for (var i = 0; i < eatings.length; i++)
    if (eatings[i].name == name) {
      eatings[i]['set'] = true;
      eatings[i]['disabled'] = (name != self);
      return eatings[i];
    }

  return {
    name: name,
    disabled: name != self,
    lunch: false,
    dinner: false,
    set: false
  }
}

module.exports = function(req, res) {
  self = req.params.name;
  getEatings(function(eatings) {
    var people = names.map(function(name) {
      return single(eatings, name, self);
    });

    var params = {
      title: 'Update Eatings',
      people: people,
      selfName: self
    };
    res.render('eatings/update', params);
  });
};