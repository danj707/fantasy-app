'use strict';


////////MOCK DATA, REPLACE WITH API DATA EVENTUALLY

var MOCK_TEAM = {
    team_id:1,
    team_name:'Raiders',
    user_name:'BobbyJoe',
    user_id:'1',
    helmet:2,
    quarterback:'Aaron Rodgers',
    runningback:'Adrian Peterson',
    runningback2:'Ezekiel Edwards',
    wide_receiver:'Odell Beckham Jr.',
    wide_receiver2:'Antonio Brown',
    wide_receiver3:'Julio Jones',
    kicker:'Stephen Gostkowski',
    defense:'Patriots'
}

var MOCK_PLAYERS = {
    'quarterback':[
        {
            'pid':123,
            'name':'Aaron Rodgers',
            'team':'Green Bay Packers',
            'jersey':10,
            'qbr':102.5
        },
        {
            'pid':124,
            'name':'Tom Brady',
            'team':'Patriots',
            'jersey':8,
            'qbr':101.6
        },       
        {
            'pid':125,
            'name':'Cam Newton',
            'team':'Panthers',
            'jersey':6,
            'qbr':110.5
        }
        ],
    'wr':[
        {
            'pid':167,
            'name':'Odell Beckham',
            'team':'New York Giants',
            'jersey':5,
            'YAC':12
        },
        {
            'pid':468,
            'name':'Antonio Brown',
            'team':'Pittsburg Steelers',
            'jersey':8,
            'YAC':15
        },       
        {
            'pid':335,
            'name':'Julio Jones',
            'team':'Tampa Bay Bucs',
            'jersey':6,
            'YAC':16
        }
        ],
        
}

//
function loginUser(username,password) {
    //check username and password
    $('p.error').empty();
    var request = {
        'username':username,
        'password':password
    };
    $.ajax({
            type:"GET",
            url:"https://fantasy-app-danj707.c9users.io/login",
            data: request,
            dataType:'json',
        })
        .done(function (result) { //this waits for the ajax to return with a succesful promise object
            if(result.message == 'Success') {
                if(result.team) {
                    //has a team, go to mainpage
                    var teamname = result.team_name;
                    mainDisplay(teamname);
                } else {
                    //doesn't have a team, go to builder
                    genBuilder();
                }
            } else if (result.message == 'Failure') {
                $('p.login_error').text("We're sorry, there was an error.  Check your username and password");
            }
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
                $('p.login_error').text("We're sorry, that username might be taken.  Try another username.");
        });
}

function newUser(username,password) {
    $('p.error').empty();
    console.log(username,password + "new user req");
    $.ajax({
            type:"POST",
            url:"https://fantasy-app-danj707.c9users.io/users/create?username=" + username + "&password=" + password,
            dataType:'json',
        })
        .done(function (result) { //this waits for the ajax to return with a succesful promise object
            console.log("DB add sent!");
            console.log(result);
            if(result.message == 'Success') {
                genBuilder();
            } else if (result.message == 'Failure') {
                $('p.newuser_error').text("Sorry, couldn't create that account, try another username");
            }
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
                $('p.newuser_error').text("We're sorry, there was a system error, try again.");
        });
}

function getTeam(teamname) {
    $.ajax({
            type:"GET",
            url:"https://fantasy-app-danj707.c9users.io/teams/?name=" + teamname,
            dataType:'json',
        })
        .done(function (result) { //this waits for the ajax to return with a succesful promise object
            displayRoster(result);
        })
        .fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
        
        });    
}

function genBuilder() {
        $('section.intro').css('display','none');
        $('section.builder').css('display','inline-block');
}

function mainDisplay(teamname) {
        $('section.intro').css('display','none');
        $('section.builder').css('display','none');
        $('section.main').css('display','block');
        
        getTeam(teamname);
}

function displayRoster(result) {
    
        var teamname = result[0].team_name;
        console.log(result);
    
        $('h1.teamname').text(teamname + " Current Roster");
        
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
            newUser(username,password);
        }
});
    
    $('#team_builder').submit(function (event) {
        event.preventDefault();
        var teamname = $('input#teamname').val();
        var helmet = $("input[class='radio']:checked").val();

        mainDisplay();
    });

});
