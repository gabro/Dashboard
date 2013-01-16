/*
 * GET eatings/view.
 */
var Eating = require('../../models/eating.js');

module.exports = function(req, res) {
  var today = new Date();
  today.setHours(0,0,0,0);
  Eating.find({date: today}, function(err, eatings) {
    res.render('eatings/view', {eatings: eatings});
  });
};