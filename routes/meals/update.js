/*
 * POST meals/update.
 */
 var Meal = require('../../models/meal.js');

 module.exports = function(req, res) {
  var today = new Date();
  today.setHours(0,0,0,0);
  Meal.findOne({name: req.body.name, date: today}, function(err, meal) {
    if (!meal) {
      meal = new Meal();
    }
    meal.name = req.body.name;
    meal.lunch = req.body.lunch ? true : false;
    meal.dinner = req.body.dinner ? true : false;
    meal.date = today;
    meal.save(function(err) {
      res.end(JSON.stringify({err: {}}));
    });
  });
};