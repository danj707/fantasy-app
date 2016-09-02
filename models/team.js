var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
    team_id: {
        type: Number,
        required: true,
        unique:true
    },
    name: { 
        type: String,
        required: true 
    }
});

var Team = mongoose.model('Team', TeamSchema);

module.exports = Team;