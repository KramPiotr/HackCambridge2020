const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let recordSchema = new Schema({
    id: {type: Number, unique: true},
    name: String,
    surname: String,
    score: Number
});

module.exports = mongoose.model('user', recordSchema);