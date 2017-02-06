import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
window.onload = function () {
    console.log("subscribing");
    Meteor.subscribe("PlayerStats");
}

Accounts.onLogin(function () {
    console.log(Meteor.userId());
    Router.go("Profile", { _id: Meteor.userId() });
});

Template.Register.events({
    "submit form": function (e) {
        e.preventDefault();
        var email = $("[name=email]").val();
        var username = $("[name=username]").val();
        var password = $("[name=password]").val();
        var results = CreatePlayer(email, username, password);
        Router.go("Login");
    }
});

Template.Login.events({
    "submit form": function (e) {
        e.preventDefault();
        var username = $("[name=username]").val();
        var password = $("[name=password]").val();
        Meteor.loginWithPassword(username, password, function (error) {
            var errorResult = "";
            console.log(error);
            if (error != undefined) {
                if (error.error = 400) {
                    errorResult = "Invalid username or password";
                }
                document.getElementById("LoginResult").innerHTML = errorResult;
            }
            else {
                console.log("Login success!");
            }
        });
    }
});

Template.Profile.helpers({
    "Username": function () {
        return Session.get('Username');
    },
    "Exp": function () {
        return Session.get('UserExp');
    },
    "HighestRound": function () {
        return Session.get('UserHighRound');
    },
    "Kills": function () {
        return Session.get('UserKills');
    }
});

Template.Main.events({
    "click .Logout": function (e) {
        e.preventDefault();
        Meteor.logout();
        Router.go("Login");
    }
})


function CreatePlayer(email, username, password) {
    Meteor.call("CreateNewPlayer", email, username, password, function (error, result) {
        console.log(result + error);
        if (result != undefined) {
            Meteor.call("SetStats", 0, 0, 0, result);
            return result;
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