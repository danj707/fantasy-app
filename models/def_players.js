var mongoose = require('mongoose');

var DEFSchema = new mongoose.Schema({
    def_pid: {
        type: String,
        unique:true,
        required:true,
        },
    position: String,
    lname: String,
    fname: String,
    jersey: String,    
    real_team: String,
    height: String,
    weight: String,
    college: String,
});

var DEF = mongoose.model('DEF', DEFSchema);

module.exports = DEF;