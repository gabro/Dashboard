var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var EatingSchema = new Schema({
    name    : { type: String }
    date    : { type: Date }
    type    : { type: String, enum: ['breakfast', 'dinner', 'lunch']}
});

module.exports = mongoose.model('Eating', EatingSchema);
