'use strict';

var MOCK_USERS = {
    username:'danj707',
    password:'password01',
    user_id:'1',
    team_name:''
};

var MOCK_TEAM = {
    team_name:'Raiders',
    user_id:'1',
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
            'jersey':10,
            'qbr':102.5
        },
        {
            'pid':124,
            'name':'Tom Brady',
            'jersey':8,
            'qbr':101.6
        },       
        {
            'pid':125,
            'name':'Cam Newton',
            'jersey':6,
            'qbr':110.5
        }
        ]
}

function loginUser(username,password) {
    //check username and password
    $('p.error').empty();
    if(username == MOCK_USERS.username) {
        if(password == MOCK_USERS.password) {
            if(MOCK_USERS.team_name == '') {
                //user doesn't have a team yet, just a UN/PW, send to genBuilder
                console.log("Login Good, but no team");
                return true;
            } else {
                console.log("Has a team, head to display page");
                mainDisplay();
            }
        } else {
            return false;
        } 
    } else {
        return false;
    }
}

function genBuilder(teamname,builder) {
    
}

function mainDisplay() {
            $('section.intro').css('display','none');
            $('section.builder').css('display','none');
            $('section.main').css('display','inline-block');
}

$(document).ready(function () {
    $('#login').submit(function (event) {
        event.preventDefault();
        var username = $('input#username').val();
        var password = $('input#password').val();
        var logincheck = loginUser(username,password);
        
        if(logincheck) {
            $('section.intro').css('display','none');
            $('section.builder').css('display','inline-block');
        } else {
            $('p.error').text("We're sorry, there was an error.  Check your username and password");
        }
    });
    
    $('#team_builder').submit(function (event) {
        event.preventDefault();
        var teamname = $('input#teamname').val();
        var helmet = $("input[class='radio']:checked");
        console.log(teamname,helmet);
        
        mainDisplay();
    });

});
