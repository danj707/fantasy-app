var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

var config=require('./config');

//require schemas for team, user and players
var Team = require('./models/team');
var User = require('./models/user');
var Players = require('./models/players');

//serves static files and uses json bodyparser
app.use(express.static('public'));
app.use(bodyParser.json());

var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};

////////////////////////////////////////////////////
/////////////TEAMS//////////////////////////////////
////////////////////////////////////////////////////
//GET route, displays a list of all the items in DB
app.get('/teams', function(req, res) {
    Team.find(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(items);
    });
});


//GET A TEAM BY NAME, returns team object
app.get('/teams/:name', function(req, res) {
    var name = req.params.name;
    Team.findOne({
        name:name    
    }, function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(items);
    });
});

///////////CREATES NEW TEAM IN DB
app.post('/teams', function(req, res) {
    Team.create({
        team_id: req.query.team_id,
        team_name: req.query.team_name,
        user_name: req.query.user_name,
        user_id:req.query.user_id,
        helmet:req.query.helmet,
        QB:req.query.QB,
        RB1:req.query.RB1,
        RB2:req.query.RB2,
        WR1:req.query.WR1,
        WR2:req.query.WR2,
        WR3:req.query.WR3,
        K:req.query.K,
        DEF:req.query.DEF
    }, function(err, item) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
});

///////////////UPDATES TEAM NAME
app.put('/teams', function(req,res) {
    var team_id = {team_id:req.body.team_id};
    var update = {name:req.body.name};
    console.log(team_id,update);
   Team.findOneAndUpdate(team_id,update, function(err,items) {
         if (err) {
             return res.status(500).json({
                 message: 'Internal Server Error'
             });
         }
         res.status(201).json(items);
   });
});

//REMOVES USER BY ID FROM DB
app.delete('/teams/:id', function(req,res) {
   Team.remove({
       _id: req.params.id
   }, function(err,item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
   });
});

////////////////////////////////////////////////////////
///////////////USERS////////////////////////////////////
////////////////////////////////////////////////////////
//GET route, displays a list of all the items in DB
app.get('/users', function(req, res) {
    User.find(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(items);
    });
});

//LOGIN OF A SINGLE USER BY USERNAME AND PASSWORD FROM LOGIN PAGE
app.get('/login', function(req, res) {
    var uname = req.query.username;
    var pwd = req.query.password;
    User.findOne({
        username:uname,
        password:pwd
    }, function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        if(!items) {
            res.json({
                message: 'Failure',
                team:false
            });
        } else {
            if(items.team_name) {
                res.json({
                    message: 'Success',
                    team:true,
                    team_name:items.team_name,
                });
            } else {
                res.json({
                    message: 'Success',
                    team:false
                });
            }
        }
    });
});

////////UPDATES USER NAME
app.put('/users', function(req,res) {
    var user_id = {user_id:req.body.user_id};
    var username = {username:req.body.username};
   User.findOneAndUpdate(user_id,username, function(err,items) {
         if (err) {
             return res.status(500).json({
                 message: 'Internal Server Error'
             });
         }
         res.status(201).json(items);
   });
});

//REMOVES USER BY ID FROM DB
app.delete('/users/:id', function(req,res) {
   User.remove({
       _id: req.params.id
   }, function(err,item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
   });
});

//CREATES NEW USER IN DB, FROM NEW USER/LOGIN FORM
app.post('/users/create', function(req, res) {
    User.create({
        username: req.query.username,
        password: req.query.password,
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        if(item) {
            res.json({
                message: 'Success',
            });
        }
    });
});

////////////////////////////////////////////////////////////
/////////////PLAYERS///////////////////////////////////////
///////////////////////////////////////////////////////////
//PUT route, updates the player by id from the DB
app.put('/players/:id', function(req,res) {
    var id = {_id:req.body._id};
    var update = {name:req.body.name};
   Team.findOneAndUpdate(id,update, function(err,items) {
         if (err) {
             return res.status(500).json({
                 message: 'Internal Server Error'
             });
         }
         res.status(201).json(items);
   });
});

//DELETE route, removes the player by name from the DB
app.delete('/players/:id', function(req,res) {
   Team.remove({
       _id: req.params.id
   }, function(err,item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
   });
});


app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

exports.app = app;
exports.runServer = runServer;