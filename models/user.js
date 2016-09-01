var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    team_name: {
        type: String,
        required: true
    },
    user_id: {
        type: Number,
        required: true
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;