var OgsimBattle = require("./ogsim/battle");

//Battle setup

//A list (or group) of fleets.
var attackerList = [
    //Fleet configuration object. You can add more fleets to this list using the following structure:
    {
        //List of ships or defenses: {"unit_id": amount, "unit_id": amount, "unit_id": amount, ...}
        //Check ogsim/config.js for a valid list of unit types
        "fleet": {"204": 1500000},
        "player_id" : "1", //Just invent a numeric value. A player can have different fleets in both lists, identified by their player id
        "military_tech" : 10,
        "defense_tech" : 10,
        "hull_tech" : 10
    }  /* ,
    {
        "fleet": {"203":100, "204":2},
        "player_id": "10000",
        "military_tech": 11,
        "defense_tech": 9,
        "hull_tech": 11
    }
    */
];

var defenderList = [
    {
        "fleet": {"206": 200000},
        "player_id" : "2",
        "military_tech" : 10,
        "defense_tech" : 10,
        "hull_tech" : 10
    }
];

//use the player ids indicated above
var PlayerList = {
    "1" : "Player 1 Name",
    "2" : "Player 2 Name"
};

//TODO: Currently this simulates the battle once. We will pass an object with some configuration values in the future
var numSimulations = 2;

var battle = new OgsimBattle(attackerList, defenderList, numSimulations, function(stats, rounds){
    console.log(stats); //Statistics at the end of the battle
    console.log(rounds); //what happened every round
});
