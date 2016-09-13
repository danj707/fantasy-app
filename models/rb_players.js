var mongoose = require('mongoose');

var RBSchema = new mongoose.Schema({
    rb_pid: {
        type: String,
        unique:true,
        required:true,
        },
    position: String,
    lname: String,
    fname: String,
    jersey: String,    
    real_team: String,
    heigtt: String,
    weight: String,
    college: String,
    link: String,
});

var RB = mongoose.model('RB', RBSchema);

module.exports = RB;