var mongoose = require('mongoose');

var QBSchema = new mongoose.Schema({
    qb_pid: {
        type: String,
        unique:true,
        required:true,
        },
    position: {
        type: String,
    },
    lname: {
        type: String,
    },
    fname: {
        type: String,
    },
    jersey: {
        type:String,    
    },
    real_team: {
        type:String,
    },
    height: {
        type: String,
    },
    weight: {
        type: String,
    },
    college: {
        type: String,
    },
    link: {
        type: String,
    },
});

var QB = mongoose.model('QB', QBSchema);

module.exports = QB;