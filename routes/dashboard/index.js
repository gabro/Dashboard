/*
 * GET home page.
 */

 getEatings = require('eatings');

 module.exports = function(req, res) {
  getEatings(function(eatings) {
    res.setHeader('Access-Control-Allow-Origin', 'https://gist.github.com');
    res.render('dashboard/index', { title: 'Dashboard', eatings: eatings});
  });
};