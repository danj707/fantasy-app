var mongoose = require('mongoose');

var KSchema = new mongoose.Schema({
    k_pid: {
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
    }
});

var K = mongoose.model('K', KSchema);

module.exports = K;