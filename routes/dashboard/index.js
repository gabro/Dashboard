/*
 * GET home page.
 */

module.exports = function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', 'https://gist.github.com');
  res.render('dashboard/index', { title: 'Dashboard'});
};
