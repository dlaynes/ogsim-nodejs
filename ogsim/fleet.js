var Resource = require('./resource');
var Fleetunittype = require('./fleetunittype');
var Tools = require('./tools');

//List of ships belonging to a player, sent in the same Ogame mission.
//Optionally, a player can add more fleets to a mission
var fleet = function(fleetUnits, pricelist, rapidfireConfig, military_tech, defense_tech, hull_tech, player_id){
    var amount, res, tf;

    this.player_id = player_id;
    //base technologies of the current fleet
    this.d = 1 + (military_tech * 0.1);
    this.s = 1+ (defense_tech * 0.1);
    this.h = (1 + (hull_tech * 0.1) ) * 0.1;

    this.unitTypes = {};
    //List of ships of the current fleet
    for(var id in fleetUnits){
        if(!fleetUnits.hasOwnProperty(id)){ continue; } //!!
        amount = fleetUnits[id];
        res = new Resource(pricelist[id], rapidfireConfig);
        ft = new Fleetunittype(res, amount, this.d, this.s, this.h);
        this.unitTypes[id] = ft;

    }
    //TODO
    //this.fleetUnits = fleetUnits;
};

//Push the fleet data configuration to the global array of ships
fleet.prototype.expandTo = function(dataArray){
    var model, ut, apA = Tools.appendToArray;

    for( var id in this.unitTypes ){
        if(!this.unitTypes.hasOwnProperty(id)){ continue; }
        ut = this.unitTypes[id];

        //template of a ship
        model = [
            ut.h, //Ship Hull
            ut.s, //Ship shields, they are repaired after every turn
            ut //Unit type of the ship. (Object reference, good performance)
        ];
        //add the template to the global array list
        apA(dataArray, model, ut.m);
    }
};

//TODO: update the configuration values of the fleet
fleet.prototype.compress = function(){
    var capacity, data;

    for( var ut in this.unitTypes ){

    }

    return {
        "capacity": capacity,
        "fleet": data
    };
};

//TODO:
fleet.prototype.buildReport = function(){

};

//status of the current fleet, after a round of shots
fleet.prototype.getStats = function(){
    var res = [], item, ut;

    for( var id in this.unitTypes ){
        if(!this.unitTypes.hasOwnProperty(id)){ continue; }
        ut = this.unitTypes[id];
        if(ut.x != ut.m){
            item = {
                id: id, /* Unit type ID */
                difference: ut.m - ut.x, /* Remaining ships of this fleet's unit type, after a round */
                military_tech: ut.d, /* Attack, Defense and hull points */
                defense_tech: ut.s,
                hull_tech: ut.h
            };
            res.push(item);
        }
    }
    return res;
};

module.exports = fleet;