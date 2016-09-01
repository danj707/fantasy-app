var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
    name: { 
        type: String, required: true 
    }
});

var Team = mongoose.model('Team', TeamSchema);

module.exports = Team;