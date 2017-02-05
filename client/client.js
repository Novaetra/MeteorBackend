import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

window.onload = function()
{
    Meteor.subscribe("PlayerStats",function(){
        ConfigureRouter();
        DeclareHelpers();
    });
}

Template.Register.events({
    "submit form":function(e)
    {
        e.preventDefault();
        var email = $("[name=email]").val();
        var username = $("[name=username]").val();
        var password = $("[name=password]").val();
        var results = Meteor.call("CreateNewPlayer",email,username,password);
        Router.go("Profile",{_id:results});
    }
});

Template.Login.events({
   "submit form":function(e)
    {
        e.preventDefault();
        var username = $("[name=username]").val();
        var password = $("[name=password]").val();
        Meteor.loginWithPassword(username, password, function(error){
            var errorResult = "";
            console.log(error);
            if(error!=undefined)
            {
                if(error.error = 400)
                {
                    errorResult = "Invalid username or password";
                }
                document.getElementById("LoginResult").innerHTML = errorResult;
            }
            else
            {
                console.log("Login success!");
                Router.go("Profile",{_id:Meteor.userId()});
            }
        });
    }
});


function DeclareHelpers()
{
    var profileID = window.location.href.split("/");
    for(var i=0;i<profileID.length-1;i++)
    {
        if(profileID[i]=="Profile")
        {
            profileID = profileID[i+1];
        }
    }
    console.log(profileID);
    console.log(PlayerStats.find().fetch());
    var statsOBJ = PlayerStats.find(profileID).fetch()[0];
    Template.Profile.helpers({
            "Username":function()
            {  
                return Meteor.users.find(profileID).fetch()[0].username;
            },
            "Exp":function()
            { 
                return statsOBJ.exp; 
            },
            "HighestRound":function()
            {
                return statsOBJ.maxRound;
            },
            "Kills":function()
            {
                return statsOBJ.kills;
            }
        }); 
}

/*
//Declares what functions are called when pages are rendered
function SetupPageStartupFunctions()
{
    Template.Main.rendered = function()
    {
        //Link the menu bar so each button goes to the right place
        LinkMenuBar();
    }
}
*/