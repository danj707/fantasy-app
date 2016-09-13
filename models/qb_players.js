var mongoose = require('mongoose');

var QBSchema = new mongoose.Schema({
    qb_pid: {
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
    link: String,
});

var QB = mongoose.model('QB', QBSchema);

module.exports = QB;