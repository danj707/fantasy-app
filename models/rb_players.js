var mongoose = require('mongoose');

var RBSchema = new mongoose.Schema({
    rb_pid: {
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

var RB = mongoose.model('RB', RBSchema);

module.exports = RB;