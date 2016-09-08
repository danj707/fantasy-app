var mongoose = require('mongoose');

var DEFSchema = new mongoose.Schema({
    def_pid: {
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

var DEF = mongoose.model('DEF', DEFSchema);

module.exports = DEF;