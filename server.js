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
app.use(bodyParser.urlencoded({
  extended: true
}));

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
        team_name: req.body.team_name,
        user_id: req.body.user_id,
        user_name: req.body.user_name,
        helmet:req.body.helmet,
        QB:'',
        RB1:'',
        RB2:'',
        WR1:'',
        WR2:'',
        WR3:'',
        K:'',
        DEF:''
    }, function(err, item) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        console.log("Create new team");
        return res.json(item);
    });
});

///////////////UPDATES TEAM NAME AND HELMET
app.put('/team', function(req,res) {
    var _id = {_id:req.body.team_id};
    var teamname = {name:req.body.teamname};
    var helmet = {helmet:req.body.helmet};
    console.log(_id,teamname,helmet);
   Team.findOneAndUpdate({
       _id:_id,
       team_name:teamname,
       helmet:helmet
    },  function(err,items) {
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
            //bad login, un/password mismatch
            console.log("User:" + uname + " attempted login!");
            return res.status(401).json({
                message: 'Not found'
            });
        } else {
            return res.json(items);
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
         console.log("Updated username!");
         res.status(201).json(items);
   });
});

////////UPDATES TEAM NAME IN USER TABLE
app.put('/users/:team', function(req,res) {
    var _id = {_id:req.body.user_id};
    var team_name = {team_name:req.body.team_name};
    console.log(req.body);
   User.findOneAndUpdate(_id,team_name, function(err,items) {
         if (err) {
             console.log(err);
             return res.status(500).json({
                 message: 'Internal Server Error'
             });
         }
         console.log("Added teamname to user");
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
        console.log("Deleted user!");
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
            console.log("Created new user!");
            return res.json(item);
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