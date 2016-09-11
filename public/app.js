'use strict';

/* global $ */

//--Sets global project name in api call, useful if we change servers, etc
var projectURL = 'https://fantasy-app-danj707.c9users.io:8080';

//--Define globals to be set after user logs in or signs up, removes need to
//pass around result object
var user_name;
var user_id;
var team_name;
var team_id;
var current_helmet;
var position;

//List of NFL teams, and their nfl logo images
var nflTEAMS = {
    BAL : ["bal.png"],
    CIN: ["cin.png"],
    CLE: ["cle.png"],
    PIT: ["pit.png"],
    CHI: ["chi.png"],
    DET: ["det.png"],
    GB:["gb.png"],
    MIN:["min.png"],
    HOU:["hou.png"],
    IND:["ind.png"],
    JAC:["jax.png"],
    TEN:["ten.png"],
    ATL:["atl.png"],
    CAR:["car.png"],
    NO:["no.png"],
    TB:["tb.png"],
    BUF:["buf.png"],
    DAL:["dal.png"],
    MIA:["mia.png"],
    NYG:["nyg.png"],
    NE:["ne.png"],
    PHI:["phi.png"],
    NYJ:["nyj.png"],
    WSH:["wsh.png"],
    DEN:["den.png"],
    ARI:["ari.png"],
    KC:["kc.png"],
    LA:["la.png"],
    OAK:["oak.png"],
    SF:["sf.png"],
    SD:["sd.png"],
    SEA:["sea.png"],
};

////////////////////////////--API Function Calls--//////////////////////////////

//--loginUser API call to log user into site
function loginUser(username, password) {
    $('p.error').empty();
    var q_string = {
        'username':username,
        'password':password
    };
    $.ajax({
            type:"POST",
            url:projectURL + "/login",
            data: q_string,
            dataType:'json',
        })
        .done(function (result) { //this waits for the ajax to return with a succesful promise object
            //When successful, set globals from result object
            user_name = result.username;
            user_id = result._id;
            if(result.team_name) {
                    //Has a team already, go to mainpage
                    team_name = result.team_name;
                    mainDisplay(result);
            } else {
                    //Doesn't have a team yet, go to team builder so they can create a team
                    genBuilder(result);
            }
        })
        .fail(function (jqXHR, error) {
                //User login was unsuccessful, due to pw/username combination was wrong
                $('p.login_error').text("We're sorry, that un/pw combination was incorrect.");
        });
}

//--newUser API to create a new user from login/signup main page
function newUser(username, password) {
    $('p.error').empty();
    var q_string = {
        'username':username,
        'password':password
    };    
    $.ajax({
            type:"POST",
            url:projectURL + "/users/create",
            data: q_string,
            dataType:'json',
        })
        .done(function (result) {
            //If successful, set some globals instead of using result object
            user_name = result.username;
            user_id = result._id;
            //TODO - Don't think we can ever get here, if we get a result back, it's always successful by default? Maybe a similar username was already chosen? - TEST THIS
            if(result.username) {
                genBuilder(result);
            } else {
                $('p.newuser_error').text("Sorry, couldn't create that account, try another username");
            }
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
                $('p.newuser_error').text("We're sorry, there was a system error, try again.");
        });
}

//--getTeam API gets ALL team information, by position, from multiple API calls
//--One to QB endpoint - /players/qb/:qb_pid
//--One to RB endpoint - /players/rb/:rb_pid
//--One to WR endpoint - /players/wr/:wr_pid
//--One to K endpoint - /players/k/:k_pid
//--One to DEF endpoint - /players/def/:def_pid
//--returns several objects, each has to be parsed out, obtain relevent information and pass to 
function getTeam() {
    
    //define function scope variables to hold the id's/keys of the players in their respective collections
    //used after the getTeam call to make specific api calls to DB for additional player information
    var qid;
    var rb1id;
    var rb2id;
    var wr1id;
    var wr2id;
    var wr3id;
    var kid;
    var defid;
    var rosterArray = [];
    
    $.ajax({
            type:"GET",
            url:projectURL + "/teams/" + team_name,
            dataType:'json',
        })
        .done(function (result) {
            if(result) {
                team_id = result._id;
                current_helmet = result.helmet;
                qid = result.QB;
                rb1id = result.RB1;
                rb2id = result.RB2;
                wr1id = result.WR1;
                wr2id = result.WR2;
                wr3id = result.WR3;
                kid = result.K;
                defid = result.DEF;
                
                $.when( 
                    $.ajax({
                            type:"GET",
                            url:projectURL + "/players/qb/" + qid,
                            dataType:'json',
                        }),
                    $.ajax({
                            type:"GET",
                            url:projectURL + "/players/rb/" + rb1id,
                            dataType:'json',
                        }),
                    $.ajax({
                            type:"GET",
                            url:projectURL + "/players/rb/" + rb2id,
                            dataType:'json',
                        }),
                    $.ajax({
                            type:"GET",
                            url:projectURL + "/players/wr/" + wr1id,
                            dataType:'json',
                        }),
                    $.ajax({
                            type:"GET",
                            url:projectURL + "/players/wr/" + wr2id,
                            dataType:'json',
                        }),
                    $.ajax({
                            type:"GET",
                            url:projectURL + "/players/wr/" + wr3id,
                            dataType:'json',
                        }),
                    $.ajax({
                            type:"GET",
                            url:projectURL + "/players/k/" + kid,
                            dataType:'json',
                        }),
                    $.ajax({
                            type:"GET",
                            url:projectURL + "/players/def/" + defid,
                            dataType:'json',
                        })
                        )
                .done(function(a1,a2,a3,a4,a5,a6,a7,a8) {
                    rosterArray.push(a1[0],a2[0], a3[0], a4[0], a5[0], a6[0], a7[0], a8[0]);
                    displayRoster(rosterArray);
                })
                .fail(function() {
                    console.log("An error in the API checks has occurred."); 
                });
            }
                
        })
        .fail(function (jqXHR, error) {
            displayRoster(error);
        });
}

//--createTeam API creates team in team table, called from Team Builder
//--Also calls API updateUserTeam after, to insert the team name into the user record
function createTeam(teamname,helmet) {
    //Create a query string from a combination of form data and global variables
    var q_string = "team_name=" + teamname + "&user_name=" + user_name + "&user_id=" + user_id + "&helmet=" + helmet;
    $.ajax({
            url:projectURL + "/teams",
            type:'POST',
            data:q_string,
        })
        .done(function (result) { //
            //Sets several global variables if the team creation was successful
            team_name = result.team_name;
            team_id = result._id;
            current_helmet = result.helmet;
            
            //API call to update the team name in the user record
            updateUserTeam(team_name);
            
            //Displays main page
            mainDisplay(result);
        })
        .fail(function (jqXHR, error) {
            $('p.error').text("An error occurred, please try again.");
        });    
}

//--updateUserTeam API to update the team name by user ID
function updateUserTeam(team_name) {
    var q_string = "user_id=" + user_id + "&team_name=" + team_name;
    $.ajax({
            url:projectURL + "/users/team",
            type:'PUT',
            data:q_string
        })
        .done(function (result) { //this waits for the ajax to return with a succesful promise object
            mainDisplay();
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
            console.log("Update teamname failed!");
        });    
}

//--updateUserTeamWithQBinfo API to update the team QB roster PID with new PID
function updateUserTeamWithQBID(player_choice) {
    var q_string = "team_id=" + team_id + "&qb_pid=" + player_choice;
    $.ajax({
            url:projectURL + "/team/roster/qb",
            type:'PUT',
            data:q_string
        })
        .done(function (result) { //this waits for the ajax to return with a succesful promise object
            console.log("Updated " + position + " in team roster succeeded!");
            position = '';
            mainDisplay();
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
            //TODO - add user error message here
            console.log("Updated " + position + " in team roster failed!");
            position = '';
        });    
}

//--updateUserTeamWithRBinfo API to update the team QB roster PID with new PID
function updateUserTeamWithRBID(choices) {
    var q_string = "team_id=" + team_id + "&rb1_pid=" + choices[0] + "&rb2_pid=" + choices[1];
    $.ajax({
            url:projectURL + "/team/roster/rb",
            type:'PUT',
            data:q_string
        })
        .done(function (result) { //this waits for the ajax to return with a succesful promise object
            position = '';
            mainDisplay();
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
            position = '';
        });    
}

//--updateUserTeamWithRBinfo API to update the team QB roster PID with new PID
function updateUserTeamWithWRID(choices) {
    var q_string = "team_id=" + team_id + "&wr1_pid=" + choices[0] + "&wr2_pid=" + choices[1] + "&wr3_pid=" + choices[2];
    $.ajax({
            url:projectURL + "/team/roster/wr",
            type:'PUT',
            data:q_string
        })
        .done(function (result) { //this waits for the ajax to return with a succesful promise object
            position = '';
            mainDisplay();
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
            position = '';
        });    
}

//--updateUserTeamWithRBinfo API to update the team QB roster PID with new PID
function updateUserTeamWithKID(choices) {
    var q_string = "team_id=" + team_id + "&k_pid=" + choices[0];
    $.ajax({
            url:projectURL + "/team/roster/k",
            type:'PUT',
            data:q_string
        })
        .done(function (result) { //this waits for the ajax to return with a succesful promise object
            position = '';
            mainDisplay();
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
            position = '';
        });    
}

//--updateUserTeamWithRBinfo API to update the team QB roster PID with new PID
function updateUserTeamWithDEFID(choices) {
    var q_string = "team_id=" + team_id + "&def_pid=" + choices[0];
    $.ajax({
            url:projectURL + "/team/roster/def",
            type:'PUT',
            data:q_string
        })
        .done(function (result) { //this waits for the ajax to return with a succesful promise object
            position = '';
            mainDisplay();
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
            position = '';
        });    
}

//--editTeam API to update the team name and helmet choice
function editTeam(teamname,helmet) {
    //Gets the new team name and helmet choice from the form input
    var q_string = "team_id=" + team_id + "&team_name=" + teamname + "&helmet=" + helmet;
    $.ajax({
            url:projectURL + "/team",
            type:'PUT',
            data:q_string
        })
        .done(function (result) {
            //Update succeeded, update the teamname and new helmet choice
            team_name = teamname;
            current_helmet = helmet;
            
            //If successful, also update the user record with the new helmet and team name
            updateUserTeam(team_name);
            
            //Display the main page
            mainDisplay(result);
        })
        .fail(function (jqXHR, error) {
            $('p.error').text("An error occurred, please try again.");
        });    
}

//--getNewPlayer API gets a list of all available players by position, 
//--builds page to let user choose new players to add to team
function getNewPlayers(position) {
    $.ajax({
            type:"GET",
            url:projectURL + "/players/" + position,
            dataType:'json',
        })
        .done(function (result) {
            if(result) {
                //Successfully got the player information from table by position, display the update page to make new
                //choices, update the player's roster, etc
                playerUpdatePage(result,position);
            } else {
                //Search returned null, team doesn't exist - do something here TODO
            }            
        })
        .fail(function (jqXHR, error) {
            $('p.error').text("Sorry, a database error occurred, try again later.");
        });
        

}

//--Display the player update page, generic for position, etc.  Displays form handler for adding/updating players
//--to team roster
function playerUpdatePage(result,position) {
        $('ul.player_list').empty();
        for(var i=0;i<result.length;i++) {
            
            var name = result[i].fname + " " + result[i].lname;
            var real_team = result[i].real_team;

            if(position === 'qb') {
                var position_pid = result[i].qb_pid;
                $('p#notes').text("Pick one quarterback.");
                if(result[i].link) {
                    $('ul.player_list').append("<label id='player_update'><li class=indiv_players>" + name + " - " + real_team + "<input type='radio' name='player' value=" + position_pid + "></input><a id='outlink' href=" + result[i].link + " target=_blank>NFL.Com Stats-<i class='fa fa-external-link' aria-hidden='true'></a></i></li></label>");
                } else {
                    $('ul.player_list').append("<label id='player_update'><li class=indiv_players>" + name + " - " + real_team + "<input type='radio' name='player' value=" + position_pid + "></input></li></label>");
                }
            } else if (position === 'rb') {
                var position_pid = result[i].rb_pid;
                $('p#notes').text("Pick two runningbacks.");
                if(result[i].link) {
                    $('ul.player_list').append("<label id='player_update'><li class=indiv_players>" + name + " - " + real_team + "<input type='checkbox' name='player' value=" + position_pid + "></input><a id='outlink' href=" + result[i].link + " target=_blank>NFL.Com Stats-<i class='fa fa-external-link' aria-hidden='true'></a></i></li></label>");
                } else {
                    $('ul.player_list').append("<label id='player_update'><li class=indiv_players>" + name + " - " + real_team + "<input type='checkbox' name='player' value=" + position_pid + "></input></li></label>");
                }
            } else if (position === 'wr') {
                var position_pid = result[i].wr_pid;
                $('p#notes').text("Pick three wide receivers.");
                if(result[i].link) {
                    $('ul.player_list').append("<label id='player_update'><li class=indiv_players>" + name + " - " + real_team + "<input type='checkbox' name='player' value=" + position_pid + "></input><a id='outlink' href=" + result[i].link + " target=_blank>NFL.Com Stats-<i class='fa fa-external-link' aria-hidden='true'></a></i></li></label>");
                } else {
                    $('ul.player_list').append("<label id='player_update'><li class=indiv_players>" + name + " - " + real_team + "<input type='checkbox' name='player' value=" + position_pid + "></input></li></label>");
                }
            } else if (position === 'k') {
                var position_pid = result[i].k_pid;
                $('p#notes').text("Pick one kicker.");
                $('ul.player_list').append("<label id='player_update'><li class=indiv_players>" + name + " - " + real_team + "<input type='checkbox' name='player' value=" + position_pid + "></input></li></label>");
            } else if (position === 'def') {
                var position_pid = result[i].def_pid; 
                $('p#notes').text("Pick one defense.");
                $('ul.player_list').append("<label id='player_update'><li class=indiv_players>" + name + " - " + real_team + "<input type='checkbox' name='player' value=" + position_pid + "></input></li></label>");
            }
        }

}

//--Activates sections to display the Team Builder Page
function genBuilder() {
        $('section.intro').css('display', 'none');
        $('section.builder').css('display', 'block');
        $('section.new_account').css('display','none');
        
        if(team_name) {
            $('input#teamname').attr('placeholder',team_name);
        } else {
            $('h2#builder_notify').html("Welcome " + user_name + "! Choose a fantasy team name:");
            $('input#teamname').attr('placeholder','teamname');   
        }
        //API call handled by document code
}

//--Activates sections to display the main Roster page, makes API call to display team roster
function mainDisplay(result) {
        $('section.intro').css('display', 'none');
        $('section.builder').css('display', 'none');
        $('section.main').css('display', 'block');
        $('section.player_edits').css('display', 'none');

        getTeam(result);
}

//--Activates main Roster page, makes API call to get the team information
//--This is the #1 section I'd like to refactor, version 1.1.  Clean up this code.
function displayRoster(rosterArray,error) {
    
        $('h2#team_name').text(team_name);

        if(current_helmet) {
            $('img.helmet_logo').attr("src","images/"+ current_helmet + "-helmet.jpg");
        } else {
            //display a generic helmet image
            $('img.helmet_logo').attr("src","images/black-helmet.jpg");
        }

        if(error) {
            $('h1.teamname').text("Sorry, there was an error getting your team roster, try again later.");
        } else {
            $('h1.teamname').text(team_name + " Current Roster");
        }
        
        //------------------Quarterback-------------------------//
        
        if (!rosterArray[0].real_team) {
            var qb_team_image = "nfl.jpg";
        } else {
            var qb_team = rosterArray[0].real_team;
            var eval_str = 'nflTEAMS.' + qb_team + '[0]';
            var qb_team_image = eval(eval_str);
        }

        if(rosterArray[0].real_team) {
            var q_href_link = "https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=" + rosterArray[0].fname + rosterArray[0].lname;
            $('.qb_position').css("background-image","url(images/" + qb_team_image + ")");
            $('p#qb_name').html('<a href=' + "" + q_href_link + "" + ' target=_blank>' + rosterArray[0].fname + " " + rosterArray[0].lname + "</a>" + " (" + rosterArray[0].jersey +  ")");
            $('p#qb_team').text("Team: " + rosterArray[0].real_team);
            $('p#qb_stats').text("Height: " + rosterArray[0].height + ", Weight: " + rosterArray[0].weight);
            $('p#qb_college').text("College: " + rosterArray[0].college);
        } else {
            $('.qb_position').css("background-image","url(images/" + qb_team_image + ")");
            $('p#qb_name').text("Not set");           
        }
        
        //------------------Running back-------------------------//
        
        if (!rosterArray[1].real_team) {
            var image_loc = "nfl.jpg";
        } else {
            var rb1_team = rosterArray[1].real_team;
            var eval_str = 'nflTEAMS.' + rb1_team + '[0]';
            var image_loc = eval(eval_str);
        }
        
        if(rosterArray[1].real_team) {
            var rb1_href_link = "https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=" + rosterArray[1].fname + rosterArray[1].lname;
            $('.rb1_position').css("background-image","url(images/" + image_loc + ")");
            $('p#rb1_name').html('<a href=' + "" + rb1_href_link + "" + ' target=_blank>' + rosterArray[1].fname + " " + rosterArray[1].lname + "</a>" + " (" + rosterArray[1].jersey +  ")");
            $('p#rb1_jersey').text("Jersey: " + rosterArray[1].jersey);
            $('p#rb1_team').text("Team: " + rosterArray[1].real_team);
            $('p#rb1_height').text("Height: " + rosterArray[1].height);
            $('p#rb1_stats').text("Height: " + rosterArray[1].height + ", Weight: " + rosterArray[1].weight);
            $('p#rb1_college').text("College: " + rosterArray[1].college);
        } else {
            $('.rb1_position').css("background-image","url(images/" + image_loc + ")");
            $('p#rb1_name').text("Not set");                
        }   
        
        //------------------ RB2 -----------------------//
        
        if (!rosterArray[2].real_team) {
            var image_loc = "nfl.jpg";
        } else {
            var rb2_team = rosterArray[2].real_team;
            var eval_str = 'nflTEAMS.' + rb2_team + '[0]';
            var image_loc = eval(eval_str);
        }
        
        if(rosterArray[2].real_team) {
            var rb2_href_link = "https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=" + rosterArray[2].fname + rosterArray[2].lname;
            $('.rb2_position').css("background-image","url(images/" + image_loc + ")");
            $('p#rb2_name').html('<a href=' + "" + rb2_href_link + "" + ' target=_blank>' + rosterArray[2].fname + " " + rosterArray[2].lname + "</a>" + " (" + rosterArray[2].jersey +  ")");
            $('p#rb2_jersey').text("Jersey: " + rosterArray[2].jersey);
            $('p#rb2_team').text("Team: " + rosterArray[2].real_team);
            $('p#rb2_stats').text("Height: " + rosterArray[2].height + ", Weight: " + rosterArray[2].weight);
            $('p#rb2_college').text("College: " + rosterArray[2].college);
        } else {
            $('.rb2_position').css("background-image","url(images/" + image_loc + ")");
            $('p#rb2_name').text("Not set");                
        }  

        //------------------ WR1 -----------------------//

        if (!rosterArray[3].real_team) {
            var image_loc = "nfl.jpg";
        } else {
            var wr1_team = rosterArray[3].real_team;
            var eval_str = 'nflTEAMS.' + wr1_team + '[0]';
            var image_loc = eval(eval_str);
        }
        if(rosterArray[3].real_team) {
            var wr1_href_link = "https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=" + rosterArray[3].fname + rosterArray[3].lname;
            $('.wr1_position').css("background-image","url(images/" + image_loc + ")");
            $('p#wr1_name').html('<a href=' + "" + wr1_href_link + "" + ' target=_blank>' + rosterArray[3].fname + " " + rosterArray[3].lname + "</a>" + " (" + rosterArray[3].jersey +  ")");
            $('p#wr1_jersey').text("Jersey: " + rosterArray[3].jersey);
            $('p#wr1_team').text("Team: " + rosterArray[3].real_team);
            $('p#wr1_stats').text("Height: " + rosterArray[3].height + ", Weight: " + rosterArray[3].weight);
            $('p#wr1_college').text("College: " + rosterArray[3].college);
        } else {
            $('.wr1_position').css("background-image","url(images/" + image_loc + ")");
            $('p#wr1_name').text("Not set");             
        }

        //------------------ WR2 -----------------------//

        if (!rosterArray[4].real_team) {
            var image_loc = "nfl.jpg";
        } else {
            var wr2_team = rosterArray[4].real_team;
            var eval_str = 'nflTEAMS.' + wr2_team + '[0]';
            var image_loc = eval(eval_str);
        }
        if(rosterArray[4].real_team) {
            var wr2_href_link = "https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=" + rosterArray[4].fname + rosterArray[4].lname;
            $('p#wr2_name').html('<a href=' + "" + wr2_href_link + "" + ' target=_blank>' + rosterArray[4].fname + " " + rosterArray[4].lname + "</a>" + " (" + rosterArray[4].jersey +  ")");        $('.wr2_position').css("background-image","url(images/" + image_loc + ")");
            $('p#wr2_jersey').text("Jersey: " + rosterArray[4].jersey);
            $('p#wr2_team').text("Team: " + rosterArray[4].real_team);
            $('p#wr2_stats').text("Height: " + rosterArray[4].height + ", Weight: " + rosterArray[4].weight);
            $('p#wr2_college').text("College: " + rosterArray[4].college);  
        } else {
            $('.wr2_position').css("background-image","url(images/" + image_loc + ")");
            $('p#wr2_name').text("Not set");                                
        }        
        
        //------------------ WR3 -----------------------//

        if (!rosterArray[5].real_team) {
            var image_loc = "nfl.jpg";
        } else {
            var wr3_team = rosterArray[5].real_team;
            var eval_str = 'nflTEAMS.' + wr3_team + '[0]';
            var image_loc = eval(eval_str);
        }    
        if(rosterArray[5].real_team) {
            var wr3_href_link = "https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=" + rosterArray[5].fname + rosterArray[5].lname;
            $('.wr3_position').css("background-image","url(images/" + image_loc + ")");
            $('p#wr3_name').html('<a href=' + "" + wr3_href_link + "" + ' target=_blank>' + rosterArray[5].fname + " " + rosterArray[5].lname + "</a>" + " (" + rosterArray[5].jersey +  ")");
            $('p#wr3_jersey').text("Jersey: " + rosterArray[5].jersey);
            $('p#wr3_team').text("Team: " + rosterArray[5].real_team);
            $('p#wr3_stats').text("Height: " + rosterArray[5].height + ", Weight: " + rosterArray[5].weight);
            $('p#wr3_college').text("College: " + rosterArray[5].college);        
        } else {
            $('.wr3_position').css("background-image","url(images/" + image_loc + ")");
            $('p#wr3_name').text("Not set");                 
        }

        //------------------ Kicker -----------------------//

        if (!rosterArray[6].real_team) {
            var image_loc = "nfl.jpg";
        } else {
            var k_team = rosterArray[6].real_team;
            var eval_str = 'nflTEAMS.' + k_team + '[0]';
            var image_loc = eval(eval_str);
        }     
        if(rosterArray[6].real_team) {
            var k_href_link = "https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=" + rosterArray[6].fname + rosterArray[6].lname;
            $('.k_position').css("background-image","url(images/" + image_loc + ")");
            $('p#k_name').html('<a href=' + "" + k_href_link + "" + ' target=_blank>' + rosterArray[6].fname + " " + rosterArray[6].lname + "</a>" + " (" + rosterArray[6].jersey +  ")");
            $('p#k_jersey').text("Jersey: " + rosterArray[6].jersey);
            $('p#k_team').text("Team: " + rosterArray[6].real_team);
            $('p#k_stats').text("Height: " + rosterArray[6].height + ", Weight: " + rosterArray[6].weight);
            $('p#k_college').text("College: " + rosterArray[6].college);
        } else {
            $('.k_position').css("background-image","url(images/" + image_loc + ")");
            $('p#k_name').text("Not set");            
        }

        //------------------ Defense -----------------------//

        if (!rosterArray[7].real_team) {
            var image_loc = "nfl.jpg";
        } else {
            var def_team = rosterArray[7].real_team;
            var eval_str = 'nflTEAMS.' + def_team + '[0]';
            var image_loc = eval(eval_str);
        }
        if(rosterArray[7].real_team) {
            var def_href_link = "https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=" + rosterArray[7].fname + rosterArray[7].lname;
            $('.def_position').css("background-image","url(images/" + image_loc + ")");
            $('p#def_name').html('<a href=' + "" + def_href_link + "" + ' target=_blank>' + rosterArray[7].fname + " " + rosterArray[7].lname + "</a>");
        } else {
            $('.def_position').css("background-image","url(images/" + image_loc + ")");
            $('p#def_name').text("Not set");             
        }
            
}

//--Main Doc ready function
$(document).ready(function () {
        $('section.intro').css('display', 'block');
        
        $('section.main').css('display', 'none');
        $('section.builder').css('display', 'none');
        $('section.player_edits').css('display', 'none');
    
    
    //Handle login click, call API to login user
    $('#login').submit(function (event) {
        event.preventDefault();
        var username = $('input#username').val();
        var password = $('input#password').val();
        loginUser(username,password);
});

    //Handle new user click, call API to add user
    $('#new_user').submit(function (event) {
        event.preventDefault();
        var username = $('input#new_username').val();
        var password = $('input#new_password').val();
        if(!username && password) {
            $('p.error').text("Must enter a username/password for a new user signup.");
        } else {
            newUser(username, password);
        }
});
    
    //Handle team creation
    $('#team_builder').submit(function (event) {
        event.preventDefault();
        var teamname = $('input#teamname').val();
        var helmet = $("input[class='helmet']:checked").val();
        
        //If a helmet is already set in globals, then they are editing their team, show a checked value
        if(helmet) {
            $('input#'+ helmet).attr('checked', 'true');
        }
        
        //If there is no helmet, this is the first time team is being setup
        if(!helmet) {
            $('p.error').text("Must enter a teamname and choose a helmet");
        } else {
            if(team_name) {
                editTeam(teamname, helmet);
            } else {
                createTeam(teamname, helmet);
            }
        }
    });

    //Handle clicking the 'Edit Team' link in Navbar
    $('a#builder').click(function (event) {
        $('section.main').css('display', 'none');
        $('section.intro').css('display', 'none');
        genBuilder();
    });
    
    //Handle clicking the 'Edit Team' link in Navbar
    $('a.new_user').click(function (event) {
        $('section.main').css('display', 'none');
        $('section.intro').css('display', 'none');
        $('section.new_account').css('display','block');
    });
    
    //Clicking the QB edit button calls the API to get list of available quarterbacks, page to choose them
    //and add back to the user's team
    $('#qb_edit').click(function(event) {
        event.preventDefault();
        $('p.error').empty();
        $('section.main').css('display', 'none');
        $('section.intro').css('display', 'none');
        $('section.builder').css('display', 'none');
        
        $('section.player_edits').css('display', 'block');

        position = 'qb';
        getNewPlayers(position);
    });
    
    $('#rb_edit').click(function(event) {
        event.preventDefault();
        $('p.error').empty();
        $('section.main').css('display', 'none');
        $('section.intro').css('display', 'none');
        $('section.builder').css('display', 'none');
        
        $('section.player_edits').css('display', 'block');

        position = 'rb';
        getNewPlayers(position);
    });

    
    $('#wr_edit').click(function(event) {
        event.preventDefault();
        $('p.error').empty();
        $('section.main').css('display', 'none');
        $('section.intro').css('display', 'none');
        $('section.builder').css('display', 'none');
        
        $('section.player_edits').css('display', 'block');

        position = 'wr';
        getNewPlayers(position);
    });
    
    $('#def_edit').click(function(event) {
        event.preventDefault();
        $('p.error').empty();
        $('section.main').css('display', 'none');
        $('section.intro').css('display', 'none');
        $('section.builder').css('display', 'none');
        
        $('section.player_edits').css('display', 'block');

        position = 'def';
        getNewPlayers(position);
    });
    
    $('#k_edit').click(function(event) {
        event.preventDefault();
        $('p.error').empty();
        $('section.main').css('display', 'none');
        $('section.intro').css('display', 'none');
        $('section.builder').css('display', 'none');
        
        $('section.player_edits').css('display', 'block');

        position = 'k';
        getNewPlayers(position);
    });
    
    $('#player_update').submit(function(event) {
       event.preventDefault();
       $('p.error').empty();
       var player_choice = $("input[name='player']:checked").val();
       
        var choices=[];
        $.each($("input[name='player']:checked"), function(){            
            choices.push($(this).val());
        });

       if(position === 'qb') {
            if(choices.length != 1) {
              $('p.error').text("Must choose a quarterback"); 
            } else {
                updateUserTeamWithQBID(player_choice);
            }
       } else if(position === 'rb') {
           //test for correct number of choices made for RB's
           if(choices.length != 2) {
                $('p.error').text("Please choose 2 running backs"); 
           } else {
                updateUserTeamWithRBID(choices); 
           }
       } else if(position === 'wr') {
            if(choices.length != 3) {
                $('p.error').text("Please choose 3 wide receivers");
           } else {
                updateUserTeamWithWRID(choices);
           }
       } else if(position === 'k') {
            if(choices.length !=1 ) {
                $('p.error').text("Must choose 1 kicker");
           } else {
                updateUserTeamWithKID(choices);
           }
       } else if(position === 'def') {
            if(choices.length != 1) {
                $('p.error').text("Must choose 1 defense");
           } else {
                updateUserTeamWithDEFID(choices);
           }           
       }
    });

});
