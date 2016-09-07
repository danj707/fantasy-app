'use strict';

/* global $ */

//TODO

//Add global var
//Update findOneandUpdate

var projectURL = 'https://fantasy-app-danj707.c9users.io';
var user_name;
var user_id;
var team_name;
var team_id;
var helmet;

//API CALL TO ENDPOINT FOR USERNAME/PW LOGIN
function loginUser(username,password) {
    //check username and password
    $('p.error').empty();
    var request = {
        'username':username,
        'password':password
    };
    $.ajax({
            type:"GET",
            url:projectURL + "/login",
            data: request,
            dataType:'json',
        })
        .done(function (result) { //this waits for the ajax to return with a succesful promise object
            user_name = result.username;
            user_id = result._id;
            if(result.team_name) {
                    //has a team, go to mainpage
                    team_name = result.team_name;
                    mainDisplay(result);
            } else {
                    //doesn't have a team, go to builder
                    genBuilder(result);
            }
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
                $('p.login_error').text("We're sorry, that un/pw combination was incorrect.");
        });
}

//API CALL TO ENDPOINT FOR NEW USER CREATION
function newUser(username, password) {
    $('p.error').empty();
    $.ajax({
            type:"POST",
            url:"https://fantasy-app-danj707.c9users.io/users/create?username=" + username + "&password=" + password,
            dataType:'json',
        })
        .done(function (result) { //this waits for the ajax to return with a succesful promise object
            user_name = result.username;
            user_id = result._id;
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

//API CALL TO ENDPOINT FOR GET TEAM DATA BY TEAM NAME
//ToDo - Cleanup parameters, passed in by var object
function getTeam() {
    $.ajax({
            type:"GET",
            url:"https://fantasy-app-danj707.c9users.io/teams/?name=" + team_name,
            dataType:'json',
        })
        .done(function (result) { //this waits for the ajax to return with a succesful promise object
            displayRoster(result);
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
            //todo something failure-ish here
        });    
}

function createTeam(teamname,helmet) {
        var data = "team_name=" + teamname + "&user_name=" + user_name + "&user_id=" + user_id + "&helmet=" + helmet;
    $.ajax({
            url:"https://fantasy-app-danj707.c9users.io/teams",
            type:'POST',
            data:data,
        })
        .done(function (result) { //this waits for the ajax to return with a succesful promise object
            console.log("Success!");
            team_name = result.team_name;
            team_id = result._id;
            helmet = result.helmet;
            updateUserTeam(result,teamname);
            mainDisplay(result);
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
            console.log("Crap, failure!");
            $('p.error').text("An error occurred, please try again.");
        });    
}

function updateUserTeam(result,teamname) {
    var data = "user_id=" + result.user_id + "&team_name=" + teamname;
    console.log(data);
    $.ajax({
            url:"https://fantasy-app-danj707.c9users.io/users/team",
            type:'PUT',
            data:data
        })
        .done(function (result) { //this waits for the ajax to return with a succesful promise object
            console.log("Update team name succeeded!");
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
            console.log("Update teamname failed!");
        });    
}

function editTeam(teamname,helmet) {
    console.log(team_id,teamname,helmet);
    
    var data = "team_id=" + team_id + "&team_name=" + teamname + "&helmet=" + helmet;
    console.log(data);
    $.ajax({
            url:"https://fantasy-app-danj707.c9users.io/team",
            type:'PUT',
            data:data
        })
        .done(function (result) { //this waits for the ajax to return with a succesful promise object
            console.log(result);
            console.log("Update team info succeeded!");
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
            console.log(result);
            console.log("Update team info failed!");
        });    
}


function genBuilder() {
        $('section.intro').css('display','none');
        $('section.builder').css('display','inline-block');
        //API call handled by document code
}

function mainDisplay(result) {
        $('section.intro').css('display','none');
        $('section.builder').css('display','none');
        $('section.main').css('display','block');
        getTeam(result);
}

function displayRoster(result) {
        $('h1.teamname').text(team_name + " Current Roster");
        $('p#qb_name').text("Name: " + result[0].QB);
        $('p#rb1_name').text("Name: " + result[0].RB1);
        $('p#rb2_name').text("Name: " + result[0].RB2);
        $('p#wr1_name').text("Name: " + result[0].WR1);
        $('p#wr2_name').text("Name: " + result[0].WR2);
        $('p#wr3_name').text("Name: " + result[0].WR3);
        $('p#k_name').text("Name: " + result[0].K);      
        $('p#defense').text("Name: " + result[0].DEF);
}

$(document).ready(function () {
    
    $('#login').submit(function (event) {
        event.preventDefault();
        var username = $('input#username').val();
        var password = $('input#password').val();
        loginUser(username,password);
});

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
    
    $('#team_builder').submit(function (event) {
        event.preventDefault();
        var teamname = $('input#teamname').val();
        var helmet = $("input[class='helmet']:checked").val();
        
        if(helmet) {
            $('input#'+ helmet).attr('checked','true');
        }
        
        if(!helmet) {
            $('p.error').text("Must enter a teamname and choose a helmet");
        } else {
            if(team_name) {
                editTeam(teamname,helmet);
            } else {
                createTeam(teamname,helmet);
            }
        }
    });

    $('a#builder').click(function (event) {
        $('section.main').css('display','none');
        $('section.intro').css('display','none');
        genBuilder();
        
    });

});
