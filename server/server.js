import { Meteor } from 'meteor/meteor';

Meteor.startup(() => 
{
    DeclareMeteorMethods();
    PublishCollections();
});


//Publishes collections
function PublishCollections()
{
    Meteor.publish("PlayerStats", function(){
        return PlayerStats.find();
    });
}

//Sets the stats of a player inside the ‘PlayerStats’ collection
function SetStats(roundsSurvived,experienceGained,enemiesKilled,playerID)
{
    if(Meteor.users.find(playerID).fetch()[0]!=null)
            {
                var user = Meteor.users.find(playerID).fetch()[0];
                if(PlayerStats.find(user._id).fetch()[0]!=null)
                {
                    var plr = PlayerStats.find(user._id).fetch()[0];
                    console.log("FOUND HIM! -- " + plr.username);
                    
                    if(roundsSurvived>plr.maxRounds)
                    {
                        PlayerStats.update(plr._id,{$max: {maxRounds: roundsSurvived}});
                        console.log("Updated rounds survived to " + PlayerStats.find(playerID).fetch()[0].maxRounds);
                    }
                    
                    PlayerStats.update(plr._id,{$inc: {exp: experienceGained}});
                    PlayerStats.update(plr._id,{$inc: {kills: enemiesKilled}});
                    console.log("Updated exp to " + PlayerStats.find(playerID).fetch()[0].exp);
                }
                else
                {
                PlayerStats.insert({
                    _id:playerID,
                    username:user.username,
                    maxRound:roundsSurvived,
                    exp:experienceGained,
                    kills:0
                });
                console.log("Added new player to player stats collection!");
                }
            }
}

//Declares the meteor methods
function DeclareMeteorMethods()
{
    Meteor.methods({
//Creates a new player account
        "CreateNewPlayer":function(email,username,password)
        {
            Accounts.createUser({
            email:email,
            username:username,
            password:password
            },function(error,results)
            {
                return results;
            });
		//This just makes sure the player is added to the ‘PlayerStats’ collectio as well.
            SetStats(0,0,0,Meteor.userId());
        },
        "SetStats":function(roundsSurvived,experienceGained,enemiesKilled,playerID)
        {
           SetStats(roundsSurvived,experienceGained,enemiesKilled,playerID);
        },
//Returns a collection
        "GetCollection":function(name)
        {
            return GetCollection(name);
        }
    });
}

//Returns a string of the collection's contents
function GetCollection(name)
{
    var collectionArray;
    console.log("Getting " + name);
    switch(name)
    {
        case "PlayerStats":
            collectionArray = PlayerStats.find().fetch();
            break;
        case "Users":
//This requires a special method because the Meteor.users collection contains a lot of additional items we dont need.
            return GetUsers();
            break;
        default:
            collectionArray = null;
            break;
    }
    
    if(collectionArray==null)
    {
        console.log("Couldnt find it");
        return;
    }
    
    var arrayString = "";
    for(var i = 0; i<collectionArray.length;i++)
    {
        var obj = collectionArray[i];
        for (var property in obj) 
        {
            if (obj.hasOwnProperty(property)) 
            {
                arrayString+=obj[property]+">";
            }
        }
        arrayString+="<";
    }
    console.log(arrayString);
    return arrayString;
}

//Need a special method for users since the collection has a lot of extra elements. This just returns username and _id
function GetUsers()
{
    var collectionArray = Meteor.users.find().fetch();
    var arrayString = "";
    console.log(collectionArray.length);
    for(var i = 0; i<collectionArray.length;i++)
    {
        var item = collectionArray[i];
        arrayString+=item.username+">"+item._id+"<";
    }
    console.log("Returning " + arrayString);
}