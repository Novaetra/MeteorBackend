# MeteorBackend
Meteor backend behind the game

1. Open up terminal window, go to folder, and start the server by running `meteor`.
2. Open up another terminal window, go to folder, and run `meteor shell`. This will allow you to call meteor server functions. 
3. Create an account on the browser.
4. You need to call the "SetStats" function to add stats to your account so you can see them appear on your profile page. 
    * Go to terminal window with the meteor shell and run `Meteor.call("SetStats",ROUNDS_SURVIVED,EXP_RECIEVED,KILLS,PLAYER_ID);`
    * You can get the player id from the last part of the url on your profile page. 


## Deploying

Run `./deploy/initiate.sh <host>`
