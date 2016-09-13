var mongoose = require('mongoose');

var WRSchema = new mongoose.Schema({
    wr_pid: {
        type: String,
        unique:true,
        required:true,
        },
    position: String,
    lname: String,
    fname: String,
    jersey: String,    
    real_team: String,
    height:String,
    weight: String,
    college: String,
    link: String,
});

var WR = mongoose.model('WR', WRSchema);

module.exports = WR;