var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var attractionsSchema = new Schema({
    id: String,
    name: String,
    image: String,
    phone: String,
    address: String,
    openTime: String,
    Ticket: String,
    intro:String,
});

module.exports = mongoose.model('attractions', attractionsSchema );