var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var MealSchema = new Schema({
    name    : { type: String },
    date    : { type: Date },
    lunch   : { type: Boolean },
    dinner  : { type: Boolean }
});

module.exports = mongoose.model('Meal', MealSchema);
