import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Router.configure({
    layoutTemplate: "Main"
});

Router.route('/', function () {
    Router.go("/Login");
});

Router.route("/Login",
    {
        name: "Login",
        template: "Login"
    });

Router.route("/Register",
    {
        name: "Register",
        template: "Register"
    });

Router.route("/Profile/:_id", {
    name: "Profile",
    template: "Profile",
    data: function () {
        var playerID = this.params._id;
        var sub = Meteor.subscribe("PlayerStats");
        if (sub.ready()) {
            setHelpers(playerID);
        }
    }
});

function setHelpers(playerID) {
    //if(Meteor.isClient)
    //{
    var statsOBJ = PlayerStats.find(playerID).fetch()[0];
    var user = Meteor.users.find(playerID).fetch()[0];
    console.log(user.username);
    if (user != undefined) {
        Session.set("Username", user.username);
        Session.set("UserExp", statsOBJ.exp);
        Session.set("UserHighRound", statsOBJ.maxRound);
        Session.set("UserKills", statsOBJ.kills);
    }
    //}
}