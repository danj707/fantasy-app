var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
    team_name: { 
        type: String,
        required: true,
        unique:true
    },
    user_id: {
        type:String,
    },
    user_name: {
        type:String
    },
    helmet: {
        type:String,
    },
    QB: {
        type:String,
    },
    RB1: {
        type: String,
    },
    RB2: {
        type: String,
    },
    WR1: {
        type: String,
    },
    WR2: {
        type: String,
    },
    WR3: {
        type: String,
    },
    K: {
        type: String,
    },
    DEF: {
        type: String,
    }
});

var Team = mongoose.model('Team', TeamSchema);

module.exports = Team;