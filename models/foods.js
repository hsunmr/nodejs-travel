var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var foodsSchema = new Schema({
    id: String,
    name: String,
    image: String,
    phone: String,
    address: String,
    openTime: String,
    intro:String,
});

module.exports = mongoose.model('foods', foodsSchema );