global.DATABASE_URL = 'mongodb://localhost/fantasy-app-test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

var Team = require('../models/team.js');
var User = require('../models/user.js');
var Players = require('../models/players.js');

chai.use(chaiHttp);

describe('Fantasy App', function() {
    before(function(done) {
        server.runServer(function() {
            Team.create({team_id:1,name:'The Killers'},
                        {team_id:2,name:'Bobs Savages'},
                        {team_id:3,name:'NY Destroyers'}, function() {
                done();
            });
        });
    });
    
        it('should list all FF /teams on GET', function(done) {
        chai.request(app)
            .get('/teams')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0]._id.should.be.a('string');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('The Killers');
                res.body[1].name.should.equal('Bobs Savages');
                res.body[2].name.should.equal('NY Destroyers');
                done();
            });
    });
    
        it('should edit a FF teamname /team/name on PUT', function(done) {
        chai.request(app)
            .put('/teams')
            .send({"team_id":'1',"update":"The chickens"})
            .end(function(err,res) {
                should.equal(err, null);
                res.body.name.should.equal('The Killers');
                res.should.have.status(201);
                res.should.be.json;
                done();
            });
    });

    //it('should add an item on post');
    //it('should edit an item on put');
    //it('should delete an item on delete');
    
        after(function(done) {
        Team.remove(function() {
            done();
        });
    });
});

