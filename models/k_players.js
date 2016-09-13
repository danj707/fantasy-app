var mongoose = require('mongoose');

var KSchema = new mongoose.Schema({
    k_pid: {
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
    college:  String,
});

var K = mongoose.model('K', KSchema);

module.exports = K;