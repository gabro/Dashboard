/*
 * GET home page.
 */

 getEatings = require('eatings');

 module.exports = function(req, res) {
  getEatings(function(eatings) {
    res.render('dashboard/index', { title: 'Dashboard', eatings: eatings});
  });
};