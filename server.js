//Server.js for FF team builder app

//require main files
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

var config=require('./config');

//require schemas for team, user and players, sep schemas for each position
var Team = require('./models/team');
var User = require('./models/user');
var QB = require('./models/qb_players');
var RB = require('./models/rb_players');
var WR = require('./models/wr_players');
var K = require('./models/k_players');
var DEF = require('./models/def_players');

var bcrypt = require('bcryptjs');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

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


//--Login of single user from login page, protected by bcrypt and hashed PWD's
app.post('/login', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var uname = req.body.username;
    var pwd = req.body.password;

            User.findOne({
                username:uname,
                }, function(err, items) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Internal Server Error'
                        });
                    }
                    if(!items) {
                        //bad username
                        return res.status(401).json({
                            message: 'Not found'
                        });
                    } else {
                        items.validatePassword(pwd, function(err, isValid) {
                            if (err) {
                                console.log("No clue what this does - if it ever logs, check it out");
                            }
                            if (!isValid) {
                                    return res.status(401).json({
                                        message: 'Not found'
                                    });
                            } else {
                                return res.json(items);
                            }
                            //return something here
                        });
                    }
                });
});

///////////-----Teams Endpoints------/////////////////////////////

//GET, displays a list of all the items in DB
app.get('/teams', function(req, res) {
    Team.find(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        } else {
            res.json(items);
        }
                
    });
});

//GET a team by name
app.get('/teams/:team_name', function(req, res) {
    var team_name = req.params.team_name;
    Team.findOne({
        team_name:team_name    
    }, function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        } else {
            res.json(items);
        }
    });
});

//CREATE a new team by name and add PID's by value
app.post('/teams', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        return res.json(item);
    });
});

//UPDATE Team Name with new teamname and helmet choice
app.put('/team', function(req,res) {
    var _id = req.body.team_id;
    var teamname = req.body.team_name;
    var helmet = req.body.helmet;
   Team.findOneAndUpdate(
       {_id:_id},
       {team_name:teamname,helmet:helmet},
       function(err,items) {
        if (err) {
             return res.status(500).json({
                 message: 'Internal Server Error'
             });
         }
         res.status(201).json(items);
   });
});

//Updates Team Roster with New Player PID's - DEV USE ONLY to manually create teams
app.put('/team/roster', function(req,res) {
        var _id = req.body.team_id;
        var qb_pid = req.body.qb_pid;
        var rb1_pid = req.body.rb1_pid;
        var rb2_pid = req.body.rb2_pid;
        var wr1_pid = req.body.wr1_pid;
        var wr2_pid = req.body.wr2_pid;
        var wr3_pid = req.body.wr3_pid;
        var k_pid = req.body.k_pid;
        var def_pid = req.body.def_pid;
   Team.findOneAndUpdate(
       {_id:_id},
       {"QB":qb_pid,"RB1":rb1_pid,"RB2":rb2_pid,"WR1":wr1_pid,"WR2":wr2_pid,"WR3":wr3_pid,"K":k_pid,"DEF":def_pid},
       function(err,items) {
        if (err) {
             return res.status(500).json({
                 message: 'Internal Server Error'
             });
         }
         return res.json(items);
   });
});

//Updates Team Roster with QB PID only
app.put('/team/roster/qb', function(req,res) {
        var _id = req.body.team_id;
        var qb_pid = req.body.qb_pid;
   Team.findOneAndUpdate(
       {_id:_id},
       {"QB":qb_pid},
       function(err,items) {
        if (err) {
             return res.status(500).json({
                 message: 'Internal Server Error'
             });
         }
         return res.json(items);
   });
});

//Updates Team Roster with RB PID's only
app.put('/team/roster/rb', function(req,res) {
        var _id = req.body.team_id;
        var rb1_pid = req.body.rb1_pid;
        var rb2_pid = req.body.rb2_pid;
   Team.findOneAndUpdate(
       {_id:_id},
       {"RB1":rb1_pid,"RB2":rb2_pid},
       function(err,items) {
        if (err) {
             return res.status(500).json({
                 message: 'Internal Server Error'
             });
         }
         return res.json(items);
   });
});

//Updates Team Roster with WR PID's only
app.put('/team/roster/wr', function(req,res) {
        var _id = req.body.team_id;
        var wr1_pid = req.body.wr1_pid;
        var wr2_pid = req.body.wr2_pid;
        var wr3_pid = req.body.wr3_pid;
   Team.findOneAndUpdate(
       {_id:_id},
       {"WR1":wr1_pid,"WR2":wr2_pid,"WR3":wr3_pid},
       function(err,items) {
        if (err) {
             return res.status(500).json({
                 message: 'Internal Server Error'
             });
         }
         return res.json(items);
   });
});

//Updates Team Roster with K PID's only
app.put('/team/roster/k', function(req,res) {
        var _id = req.body.team_id;
        var k_pid = req.body.k_pid;
   Team.findOneAndUpdate(
       {_id:_id},
       {"K":k_pid},
       function(err,items) {
        if (err) {
             return res.status(500).json({
                 message: 'Internal Server Error'
             });
         }
         return res.json(items);
   });
});

//Updates Team Roster with DEF PID's only
app.put('/team/roster/def', function(req,res) {
        var _id = req.body.team_id;
        var def_pid = req.body.def_pid;
   Team.findOneAndUpdate(
       {_id:_id},
       {"DEF":def_pid},
       function(err,items) {
        if (err) {
             return res.status(500).json({
                 message: 'Internal Server Error'
             });
         }
         return res.json(items);
   });
});
//REMOVES Team by ID from DB
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


//////////------Users Endpoints------//////////////////////////////

//GET route, displays a list of all the users in DB
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

//--Updates user name
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

//--Updates team name by user ID in users table
app.put('/users/:team', function(req,res) {
    var _id = {_id:req.body.user_id};
    var team_name = {team_name:req.body.team_name};
   User.findOneAndUpdate(_id,team_name, function(err,items) {
         if (err) {
             return res.status(500).json({
                 message: 'Internal Server Error'
             });
         }
         res.status(201).json(items);
   });
});

//--Removes user from DB
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

//--Creates new user in DB from login/signup main page
app.post('/users/create', function(req, res) {
    var username = req.body.username;
    username = username.trim();
    var password = req.body.password;
    password = password.trim();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
        
        User.create({
            username: username,
            password: hash,
        }, function(err, item) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            if(item) {
                return res.json(item);
            }
        });
        });
    });
});



////////-----Players Endpoints-----/////////////////////////////

//GET route, displays a list of all the items in the QB players table
app.get('/players/qb', function(req, res) {
    QB.find(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        } else {
            res.json(items);
        }
    });
});


//GET route, displays a list of all the items in the RB players table
app.get('/players/rb', function(req, res) {
    RB.find(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        } else {
            res.json(items);
        }
    });
});


//GET route, displays a list of all the items in the WR players table
app.get('/players/wr', function(req, res) {
    WR.find(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        } else {
            res.json(items);
        }
    });
});


//GET route, displays a list of all the items in the K players table
app.get('/players/k', function(req, res) {
    K.find(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        } else {
            res.json(items);
        }
    });
});


//GET route, displays a list of all the items in the DEF players table
app.get('/players/def', function(req, res) {
    DEF.find(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        } else {
            res.json(items);
        }
    });
});


//POST route, adds a QB to the DB by position and pid
// - For Dev use only, manual addition of players into DB
app.post('/players/qb/:qb_pid', function(req, res) {
    QB.create({
        qb_pid: req.params.qb_pid,
        position: req.body.position,
        lname: req.body.lname,
        fname: req.body.fname,
        jersey: req.body.jersey,
        real_team: req.body.real_team,
        height: req.body.height,
        weight: req.body.weight,
        college: req.body.college,
        link: req.body.link,
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        return res.json(item);
    });
});

//POST route, adds a RB to the DB by position and pid
// - For Dev use only, manual addition of players into DB
app.post('/players/rb/:rb_pid', function(req, res) {
    RB.create({
        rb_pid:req.params.rb_pid,
        position:req.body.position,
        lname:req.body.lname,
        fname:req.body.fname,
        jersey:req.body.jersey,
        real_team:req.body.real_team,
        height:req.body.height,
        weight:req.body.weight,
        college:req.body.college,
        link:req.body.link
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        return res.json(item);
    });
});

//POST route, adds a WR to the DB by position and pid
// - For Dev use only, manual addition of players into DB
app.post('/players/wr/:wr_pid', function(req, res) {
    WR.create({
        wr_pid:req.params.wr_pid,
        position:req.body.position,
        lname:req.body.lname,
        fname:req.body.fname,
        jersey:req.body.jersey,
        real_team:req.body.real_team,
        height:req.body.height,
        weight:req.body.weight,
        college:req.body.college,
        link:req.body.link
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        return res.json(item);
    });
});

//POST route, adds a K to the DB by position and pid
// - For Dev use only, manual addition of players into DB
app.post('/players/k/:k_pid', function(req, res) {
    K.create({
        k_pid:req.params.k_pid,
        position:req.body.position,
        lname:req.body.lname,
        fname:req.body.fname,
        jersey:req.body.jersey,
        real_team:req.body.real_team,
        height:req.body.height,
        weight:req.body.weight,
        college:req.body.college
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        return res.json(item);
    });
});

//POST route, adds a DEF to the DB by position and pid
// - For Dev use only, manual addition of players into DB
app.post('/players/def/:def_pid', function(req, res) {
    DEF.create({
        def_pid:req.params.def_pid,
        position:req.body.position,
        lname:req.body.lname,
        fname:req.body.fname,
        jersey:req.body.jersey,
        real_team:req.body.real_team,
        height:req.body.height,
        weight:req.body.weight,
        college:req.body.college
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        return res.json(item);
    });
});

//GET route, gets a QB from the DB by pid
app.get('/players/qb/:qb_pid', function(req, res) {
    var qb_pid = req.params.qb_pid;
    QB.findOne({
        qb_pid:qb_pid,
        }, function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        } else {
            res.json(items);
        }
    });
});

//GET route, gets a RB from the DB by pid
app.get('/players/rb/:rb_pid', function(req, res) {
    var rb_pid = req.params.rb_pid;
    RB.findOne({
        rb_pid:rb_pid,
        }, function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        } else {
            res.json(items);
        }
    });
});

//GET route, gets a WR from the DB by pid
app.get('/players/wr/:wr_pid', function(req, res) {
    var wr_pid = req.params.wr_pid;
    WR.findOne({
        wr_pid:wr_pid,
        }, function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        } else {
            res.json(items);
        }
    });
});

//GET route, gets a Kicker from the DB by pid
app.get('/players/k/:k_pid', function(req, res) {
    var k_pid = req.params.k_pid;
    K.findOne({
        k_pid:k_pid,
        }, function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        } else {
            res.json(items);
        }
    });
});

//GET route, gets a DEF from the DB by pid
app.get('/players/def/:def_pid', function(req, res) {
    var def_pid = req.params.def_pid;
    DEF.findOne({
        def_pid:def_pid,
        }, function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        } else {
            res.json(items);
        }
    });
});

//PUT route, updates the QB by id from the DB
app.put('/players/wr/:id', function(req,res) {
    var id = req.params.id;
    var link = req.body.link;
  WR.findOneAndUpdate(
      {_id: id},
      {link: link},
      function(err,items) {
         if (err) {
             return res.status(500).json({
                 message: 'Internal Server Error'
             });
         }
         res.status(201).json(items);
  });
});

//DELETE route, removes the qb by PID
app.delete('/players/qb/:qb_pid', function(req,res) {
  QB.remove({
      qb_pid: req.params.qb_pid
  }, function(err,item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
  });
});

//DELETE route, removes the wr by PID
app.delete('/players/wr/:wr_pid', function(req,res) {
  WR.remove({
      wr_pid: req.params.wr_pid
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
