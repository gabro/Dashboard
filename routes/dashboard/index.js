/*
 * GET home page.
 */

module.exports = function(req, res) {
  res.render('dashboard/index', { title: 'Dashboard'});
};