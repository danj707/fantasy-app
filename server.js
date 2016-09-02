var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

var config=require('./config');

var Team = require('./models/team');
var User = require('./models/user');
var Players = require('./models/players');

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

//require the models object
var Team = require('./models/team');
var User = require('./models/user');
var Player = require('./models/players');

/////////////TEAMS/////////////////
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

//POST route, creates the new item in the DB
app.post('/teams', function(req, res) {
    Team.create({
        team_id: req.body.team_id,
        name: req.body.name
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
});

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

///////////////USERS///////////////
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

//POST route, creates the new item in the DB
app.post('/users/:create', function(req, res) {

        var password = req.params.password;
        var team_name = req.params.team_name;
        var user_id = req.params.user_id;
        console.log(req.query);

    User.create({
        username: req.query.user_name,
        password: req.query.password,
        team_name: req.query.team_name,
        user_id: req.query.user_id
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
});

/////////////PLAYERS//////////////////
//PUT route, updates the item by id from the DB
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

//DELETE route, removes the item by name from the DB
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