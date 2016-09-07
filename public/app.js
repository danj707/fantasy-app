'use strict';

/* global $ */

//--TODO START

//Update findOneandUpdate
//--TODO END

//--Sets global project name in api call, useful if we change servers, etc
var projectURL = 'https://fantasy-app-danj707.c9users.io';

//--Define globals to be set after user logs in or signs up, removes need to
//pass around result object
var user_name;
var user_id;
var team_name;
var team_id;
var current_helmet;

////////////////////////////--API Function Calls--//////////////////////////////

//--loginUser API call to log user into site
function loginUser(username, password) {
    $('p.error').empty();
    var q_string = {
        'username':username,
        'password':password
    };
    $.ajax({
            type:"GET",
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
    $.ajax({
            type:"POST",
            url:projectURL + "/users/create?username=" + username + "&password=" + password,
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

//--getTeam API gets team information, returns as result object
function getTeam() {
    $.ajax({
            type:"GET",
            url:projectURL + "/teams/?name=" + team_name,
            dataType:'json',
        })
        .done(function (result) {
            //Successfully got team information, take to the main page
            displayRoster(result);
        })
        .fail(function (jqXHR, error) {
            displayRoster(error)
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
            console.log("Team creation successful!");
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
            console.log("Team creation failure!");
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
            console.log("Update team name succeeded!");
            //TODO - add user context success here
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
            //TODO - add user error message here
            console.log("Update teamname failed!");
        });    
}

//--editTeam API to update the team name and helmet choice
function editTeam(teamname,helmet) {
    
    //Gets the new team name and helmet choice from the form input
    var q_string = "team_id=" + team_id + "&team_name=" + teamname + "&helmet=" + helmet;
    console.log(q_string);
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
            console.log("Update team info succeeded!");
        })
        .fail(function (jqXHR, error) {
            console.log(jqXHR);
            console.log("Update team info failed!");
            $('p.error').text("An error occurred, please try again.");
        });    
}

//--Activates sections to display the Team Builder Page
function genBuilder() {
        $('section.intro').css('display', 'none');
        $('section.builder').css('display', 'inline-block');
        //API call handled by document code
}

//--Activates sections to display the main Roster page, makes API call to display team roster
function mainDisplay(result) {
        $('section.intro').css('display', 'none');
        $('section.builder').css('display', 'none');
        $('section.main').css('display', 'block');
        
        $('h2#team_name').text(team_name);
        
        if(current_helmet) {
            console.log(current_helmet);
            $('img.helmet_logo').attr("src","images/"+ current_helmet + "-helmet.jpg");
        } else {
            //display a generic helmet image
            $('img.helmet_logo').attr("src","images/black-helmet.jpg");
        }
         
        getTeam(result);
}

//--Activates main Roster page, makes API call to get the team information
function displayRoster(result,error) {
        if(error) {
            $('h1.teamname').text("Sorry, there was an error getting your team roster, try again later.");
        } else {
            $('h1.teamname').text(team_name + " Current Roster");
        }
        
        console.log(result);
        console.log(error);
        
        $('p#qb_name').text("Name: " + result[0].QB);
        $('p#rb1_name').text("Name: " + result[0].RB1);
        $('p#rb2_name').text("Name: " + result[0].RB2);
        $('p#wr1_name').text("Name: " + result[0].WR1);
        $('p#wr2_name').text("Name: " + result[0].WR2);
        $('p#wr3_name').text("Name: " + result[0].WR3);
        $('p#k_name').text("Name: " + result[0].K);      
        $('p#defense').text("Name: " + result[0].DEF);
}

//--Main Doc ready function
$(document).ready(function () {
    
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

});
