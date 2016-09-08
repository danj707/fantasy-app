var mongoose = require('mongoose');

var WRSchema = new mongoose.Schema({
    wr_pid: {
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

var WR = mongoose.model('WR', WRSchema);

module.exports = WR;