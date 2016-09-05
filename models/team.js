var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
    team_id: {
        type: Number,
        required: true,
        unique:true
    },
    team_name: { 
        type: String,
        required: true 
    },
    user_name: {
        type:String
    },
    user_id: {
        type:Number,
        required:true,
        unique:true
    },
    helmet: {
        type:Number
    },
    QB: {
        type: String,
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