'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
    name: String,
    info: String,
    active: Boolean,
    reservationStart: String,
    reservationEnd: String,
    reservationDay: String,
    idFacture: Number,
    idReservation: Number,
    salle: String
});

// ThingSchema.methods = {
//     findByDate: function(stringDate, callback) {
//         var foundThings = this.find({
//             reservationDay: stringDate
//         });
//         return foundThings;
//     }
// };

module.exports = mongoose.model('Thing', ThingSchema);