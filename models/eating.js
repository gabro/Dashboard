var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var EatingSchema = new Schema({
    name    : { type: String },
    date    : { type: Date },
    lunch   : { type: Boolean },
    dinner  : { type: Boolean }
});

module.exports = mongoose.model('Eating', EatingSchema);