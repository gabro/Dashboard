/*
 * POST eatings/update.
 */
 var Eating = require('../../models/eating.js');

 module.exports = function(req, res) {
  var today = new Date();
  today.setHours(0,0,0,0);
  Eating.findOne({name: req.body.name, date: today}, function(err, eating) {
    if (!eating) {
      eating = new Eating();
    }
    eating.name = req.body.name;
    eating.lunch = req.body.lunch ? true : false;
    eating.dinner = req.body.dinner ? true : false;
    eating.date = today;
    eating.save(function(err) {
      res.end(JSON.stringify({err: {}}));
    });
  });
};