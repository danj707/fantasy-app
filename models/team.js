var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
    team_name: { 
        type: String,
        required: true,
        unique:true
    },
    user_id: String,
    user_name: String,
    helmet: String,
    QB:String,
    RB1: String,
    RB2: String,
    WR1: String,
    WR2: String,
    WR3: String,
    K: String,
    DEF: String,
});

var Team = mongoose.model('Team', TeamSchema);

module.exports = Team;