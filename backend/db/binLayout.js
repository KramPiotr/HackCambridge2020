const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let recordSchema = new Schema({
    id: {type: Number, unique: true},
    latitude: Number,
    longtitude: Number,
    full: Number
});

module.exports = mongoose.model('bin', recordSchema);