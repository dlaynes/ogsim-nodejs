var global = {},
    console = {
        log : print
    };

/* Lib */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process,global){
module.exports = process.hrtime || hrtime

// polyfil for window.performance.now
var performance = global.performance || {}
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() }

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)/10e3
  var seconds = Math.floor(clocktime)
  var nanoseconds = (clocktime%1)*10e9
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0]
    nanoseconds = nanoseconds - previousTimestamp[1]
    if (nanoseconds<0) {
      seconds--
      nanoseconds += 10e9
    }
  }
  return [seconds,nanoseconds]
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":1}],3:[function(require,module,exports){
/*jshint node:true */

"use strict";

var minimalDesc = ['h', 'min', 's', 'ms', 'μs', 'ns'];
var verboseDesc = ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'];
var convert = [60*60, 60, 1, 1e6, 1e3, 1];

module.exports = function (source, opts) {
    var verbose, precise, i, spot, sourceAtStep, valAtStep, decimals, strAtStep, results;

    verbose = false;
    precise = false;
    if (opts) {
        verbose = opts.verbose || false;
        precise = opts.precise || false;
    }

    if (!Array.isArray(source) || source.length !== 2) {
        return '';
    }
    if (typeof source[0] !== 'number' || typeof source[1] !== 'number') {
        return '';
    }

    results = '';

    // foreach unit
    for (i = 0; i < 6; i++) {
        spot = i < 3 ? 0 : 1; // grabbing first or second spot in source array
        sourceAtStep = source[spot];
        if (i !== 3 && i !== 0) {
            sourceAtStep = sourceAtStep % convert[i-1]; // trim off previous portions
        }
        if (i === 2) {
            sourceAtStep += source[1]/1e9; // get partial seconds from other portion of the array
        }
        valAtStep = sourceAtStep / convert[i]; // val at this unit
        if (valAtStep >= 1) {
            if (verbose) {
                valAtStep = Math.floor(valAtStep); // deal in whole units, subsequent laps will get the decimal portion
            }
            if (!precise) {
                // don't fling too many decimals
                decimals = valAtStep >= 10 ? 0 : 2;
                strAtStep = valAtStep.toFixed(decimals);
            } else {
                strAtStep = valAtStep.toString();
            }
            if (strAtStep.indexOf('.') > -1 && strAtStep[strAtStep.length-1] === '0') {
                strAtStep = strAtStep.replace(/\.?0+$/,''); // remove trailing zeros
            }
            if (results) {
                results += ' '; // append space if we have a previous value
            }
            results += strAtStep; // append the value
            // append units
            if (verbose) {
                results += ' '+verboseDesc[i];
                if (strAtStep !== '1') {
                    results += 's';
                }
            } else {
                results += ' '+minimalDesc[i];
            }
            if (!verbose) {
                break; // verbose gets as many groups as necessary, the rest get only one
            }
        }
    }

    return results;
};

},{}],4:[function(require,module,exports){
(function (global){
//Ogame simulator public interface (for browserify).

//if(!global.App){ return; }
//if(document.location.hostname.indexOf("my.domain") === -1){ return;  }

global.OgsimBattle = require("./ogsim/battle");

//TODO: add jQuery events and stuff
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ogsim/battle":6}],5:[function(require,module,exports){
/* Statistics of a fleet group */

var attackstatistics = function() {
    this.ap = 0; /* Damage points per turn */
    this.sp = 0; /* Shield usage per turn */
    this.sh = 0; /* Amount of shots */
};

attackstatistics.prototype.reset = function(){
    this.ap = 0;
    this.sp = 0;
    this.sh = 0;
};

module.exports = attackstatistics;

},{}],6:[function(require,module,exports){
//var async = require("async");
var Timer = require('./timer');

var config = require('./config');
var Group = require('./group');
var Roundstatistics = require('./roundstatistics');
var Attackstatistics = require('./attackstatistics');

var Tools = require('./tools');

/* Battle between 2 fleet groups */
var battle = function( attackerList, defenderList, numSimulations, afterFunction ){
    this.timer = new Timer(attackerList, defenderList);
    this.timer.start("battle");
    this.timer.start("init");

    /* We initialize the groups */
    this.attGroup = new Group(attackerList, config.pricelist, config.rapidfire);
    this.dfGroup = new Group(defenderList, config.pricelist, config.rapidfire);
    this.report = new Roundstatistics(this.attGroup, this.dfGroup);
    this.attstats = new Attackstatistics();
    this.dfstats = new Attackstatistics();

    

    this.afterFunction = afterFunction;
    this.handleRounds();
};

battle.prototype.handleRounds = function(rounds){
    /* We initialize each group fleets */
    this.init( );
    /* We begin the battle */
    this.battle( );
};

battle.prototype.init = function(){

    this.timer.start("expand_att");
    this.attGroup.expand();
    this.timer.end("expand_att");

    this.timer.start("expand_df");
    this.dfGroup.expand();
    this.timer.end("expand_df");

    //initial state of the battle
    this.report.init(this.attstats, this.dfstats); //Will give 0,0,0 in the attack statistics

    this.timer.end('init');
};

battle.prototype.battle = function(){

    var self = this, exitRounds, round = 1;

    while(1){
        if(!this.attGroup.expandedFleet.length){
            console.log("Attackers do not have operational ships, in round "+round);
            exitRounds = true;
        }
        if(!this.dfGroup.expandedFleet.length){
            console.log("Defenders do not have operational ships, in round "+round);
            exitRounds = true;
        }
        if(exitRounds){
            break;
        }

        /* TODO: check if both attacking groups are too weak to damage each other */

        //attack loop
        self.timer.start("battle_round_"+round); //Timer start
        //Attackers attack defenders. Defenders attack attackers :)
        self.attGroup.attack(self.dfGroup, self.attstats);
        self.dfGroup.attack(self.attGroup, self.dfstats);
        self.timer.end("battle_round_"+round); //Timer end

        //clean loop
        self.timer.start("battle_clean_"+round);
        self.attGroup.clean(); //remove destroyed ships
        self.dfGroup.clean();
        self.timer.end("battle_clean_"+round);

        //build report for this round
        self.report.update(round);

        //reset round statistics
        self.attstats.reset();
        self.dfstats.reset();

        round++;
        if(round > 6){
            break;
        }
    }

    self.timer.end("battle");

    self.timer.buildResults();
    if(self.afterFunction){
        self.afterFunction(self.timer.records, self.report.results);
    }
};

module.exports = battle;

},{"./attackstatistics":5,"./config":7,"./group":10,"./roundstatistics":12,"./timer":13,"./tools":14}],7:[function(require,module,exports){
//Ogame data!!
exports.pricelist = {
    "1" : {'id':"1", 'name':'planet', 'metal':0, 'crystal':0, 'deuterium':0, 'size':0,"position": null},
    "2" : {'id':"2", 'name':'moon', 'metal':0, 'crystal':0, 'deuterium':0, 'size':0,"position": null},
    "3" : {'id':"3", 'name':'debris', 'metal':0, 'crystal':0, 'deuterium':0, 'size':0,"position": null},
    
    "109": {"id":"109", "name":"military_tech"},
    "110": {"id":"110", "name":"defense_tech"},
    "111": {"id":"111", "name":"hull_tech"},

    "202": {"id":"202", "name":"small_cargo", "metal":2000,"crystal":2000,"deuterium":0,"energy":0,"factor":1,"consumption":10,"speed":5000,"capacity":5000, "attack":5.0, "defense":10.0, "hull":4000.0 , "motor":115 , "motor2": {117:4}, "speed2":10000,"consumption2":20 },
    "203": {"id":"203", "name":"large_cargo", "metal":6000,"crystal":6000,"deuterium":0,"energy":0,"factor":1,"consumption":50,"speed":8000,"capacity":25000, "attack":5.0, "defense":25.0, "hull":12000.0 , "motor":115 },
    "204": {"id":"204", "name":"light_fighter", "metal":3000,"crystal":1000,"deuterium":0,"energy":0,"factor":1,"consumption":20,"speed":12500,"capacity":50, "attack":50.0, "defense":10.0, "hull":4000.0 , "motor":115 },
    "205": {"id":"205", "name":"heavy_fighter", "metal":6000,"crystal":4000,"deuterium":0,"energy":0,"factor":1,"consumption":75,"speed":10000,"capacity":100, "attack":150.0, "defense":25.0, "hull":10000.0 , "motor":117 },
    "206": {"id":"206", "name":"cruiser", "metal":20000,"crystal":7000,"deuterium":2000,"energy":0,"factor":1,"consumption":300,"speed":15000,"capacity":800, "attack":400.0, "defense":50.0, "hull":27000.0 , "motor":117 },
    "207": {"id":"207", "name":"battle_ship", "metal":45000,"crystal":15000,"deuterium":0,"energy":0,"factor":1,"consumption":500,"speed":10000,"capacity":1500, "attack":1000.0, "defense":200.0, "hull":60000.0 , "motor":118},
    "208": {"id":"208", "name":"colony_ship", "metal":10000,"crystal":20000,"deuterium":10000,"energy":0,"factor":1,"consumption":1000,"speed":2500,"capacity":7500, "attack":50.0, "defense":100.0, "hull":30000.0 , "motor":117},
    "209": {"id":"209", "name":"recycler", "metal":10000,"crystal":6000,"deuterium":2000,"energy":0,"factor":1,"consumption":300,"speed":2000,"capacity":20000, "attack":1.0, "defense":10.0, "hull":16000.0 , "motor":115},
    "210": {"id":"210", "name":"esp_probe", "metal":0,"crystal":1000,"deuterium":0,"energy":0,"factor":1,"consumption":1,"speed":1000000,"capacity":5, "attack":0.01, "defense":0.01, "hull":1000.0 , "motor":115 },
    "211": {"id":"211", "name":"bomber_ship", "metal":50000,"crystal":25000,"deuterium":15000,"energy":0,"factor":1,"consumption":1000,"speed":4000,"capacity":500, "attack":1000.0, "defense":500.0, "hull":75000.0 , "motor":117, "motor2": {118:7}, "speed2":5000 },
    "212": {"id":"212", "name":"solar_sat", "metal":0,"crystal":2000,"deuterium":500,"energy":0,"factor":1, "consumption": 0, "speed":0, "capacity":0, "attack":1.0, "defense":1.0, "hull":2000.0 , "motor": -1},
    "213": {"id":"213", "name":"destroyer", "metal":60000,"crystal":50000,"deuterium":15000,"energy":0,"factor":1,"consumption":1000,"speed":5000,"capacity":2000, "attack":2000.0, "defense":500.0, "hull":110000.0 , "motor":118},
    "214": {"id":"214", "name":"death_star", "metal":5000000,"crystal":4000000,"deuterium":1000000,"energy":0,"factor":1,"consumption":1,"speed":100,"capacity":1000000, "attack":200000.0, "defense":50000.0, "hull":9000000.0 , "motor":118},
    "215": {"id":"215", "name":"battle_cruiser", "metal":30000,"crystal":40000,"deuterium":15000,"energy":0,"factor":1,"consumption":250,"speed":10000,"capacity":750, "attack":700.0, "defense":400.0, "hull":70000.0 , "motor":118},

    "401": {"id":"401", "name":"rocket_launcher", "metal":2000,"crystal":0,"deuterium":0,"energy":0,"factor":1, "attack":80, "defense":20, "hull":2000},
    "402": {"id":"402", "name":"light_laser", "metal":1500,"crystal":500,"deuterium":0,"energy":0,"factor":1, "attack":100, "defense":25, "hull":2000},
    "403": {"id":"403", "name":"heavy_laser", "metal":6000,"crystal":2000,"deuterium":0,"energy":0,"factor":1, "attack":250, "defense":100, "hull":8000},
    "404": {"id":"404", "name":"gauss_cannon", "metal":20000,"crystal":15000,"deuterium":2000,"energy":0,"factor":1, "attack":1100, "defense":200, "hull":35000},
    "405": {"id":"405", "name":"ion_cannon", "metal":2000,"crystal":6000,"deuterium":0,"energy":0,"factor":1, "attack":150, "defense":500, "hull":8000},
    "406": {"id":"406", "name":"plasma_turret", "metal":50000,"crystal":50000,"deuterium":30000,"energy":0,"factor":1, "attack":3000, "defense":300, "hull":100000},
    "407": {"id":"407", "name":"small_shield_dome", "metal":10000,"crystal":10000,"deuterium":0,"energy":0,"factor":1, "attack":1, "defense":2000, "hull":20000},
    "408": {"id":"408", "name":"large_shield_dome", "metal":50000,"crystal":50000,"deuterium":0,"energy":0,"factor":1, "attack":1, "defense":10000, "hull":100000},

    "502": {"id":"502", "name":"antiballistic_missile", "metal":8000,"crystal":2000,"deuterium":0,"energy":0,"factor":1, "attack":1, "defense":1, "hull":8000},
    "503": {"id":"503", "name":"interplanetary_missile", "metal":12500,"crystal":2500,"deuterium":10000,"energy":0,"factor":1, "attack":12000, "defense":1, "hull":15000}
};

exports.rapidfire = {
    "202": {"210":5,"212":5},
    "203": {"210":5,"212":5},
    "204": {"210":5,"212":5},
    "205": {"210":5,"212":5,"203":3},
    "206": {"210":5,"212":5,"204":6,"401":10},
    "207": {"210":5,"212":5},
    "208": {"210":5,"212":5},
    "209": {"210":5,"212":5},
    "210": {},
    "211": {"210":5,"212":5,"401":120,"402":120,"403":10,"405":10},
    "212": {},
    "213": {"210":5,"212":5,"215":3,"402":10},
    "214": {"210":1250,"212":1250,"202":250,"203":250,"204":200,"205":100,"206":33,"207":30,"208":250,"209":250,"211":25,"213":5,"215":15,"401":200,"402":200,"403":100,"404":50,"405":100},
    "215": {"202":3,"203":3,"206":5,"207":8},
};

exports.lang = {
    
};
},{}],8:[function(require,module,exports){
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
},{"./fleetunittype":9,"./resource":11,"./tools":14}],9:[function(require,module,exports){
var fleetunittype = function(resource, amount, attack, defense, hull){
    this.x = 0; /* Number of ships lost */
    this.m = amount; /* Original amount of ships */
    this.i = resource.id; /* Resource ID */
    this.resource = resource;
    this.rf = {};

    //Number of remaining ships after every battle
    this.simulations = [];

    this.calcProperties(attack, defense, hull);
};

fleetunittype.prototype.calcProperties = function(attack, defense, hull){
    var the_rf;

    this.d = attack * this.resource.attack; /* Final damage points of this unittype, based on player techs */
    this.s = defense * this.resource.defense; /* Final shield points of this unittype, based on player techs */
    this.h = hull * this.resource.hull; /* Final hull points of this unittype, based on player techs */

    this.rf = this.resource.rapidFire;
};

fleetunittype.prototype.calcCapacity = function(){
    var remaining = this.m - this.x;
    if(!remaining){ return false; }

    return this.resource.capacity * remaining;
};

fleetunittype.prototype.logBattle = function(){
    this.simulations.push( this.m - this.x );
};

module.exports = fleetunittype;
},{}],10:[function(require,module,exports){
var Fleet = require('./fleet');
var Tools = require('./tools');
//var Randomarray = require('./randomarray');

/* Creation of the attacking or defending Group */
var group = function(fleetdataList, pricelist, rapidfire){
    var ft;
    this.fleets = [];
    this.expandedFleet = [];

    /* List of fleets present in the group, each one has unique characteristics and unit types (ships and defenses)
    The script will merge all the fleets from a SAC group into one giant array, but first, we are initializing the control objects
    */
    for(var i=0; i<fleetdataList.length; i++){
        ft = new Fleet(fleetdataList[i].fleet, pricelist, rapidfire, fleetdataList[i].military_tech,
            fleetdataList[i].defense_tech, fleetdataList[i].hull_tech, fleetdataList[i].player_id );
        this.fleets.push(ft);
    }
    this.fleetdataList = fleetdataList;
};

//Convert the configuration values of every fleet into a large array of data
group.prototype.expand = function(){
    var fte = [];
    for(var i=0, ft; i<this.fleets.length; i++){
        ft = this.fleets[i];
        ft.expandTo(this.expandedFleet);
    }
}

//Remove lost ships from the current fleet group
group.prototype.clean = function(){
    var cleanList = [], ship, i, l = this.expandedFleet.length;

    //Nope, using filter() or similar makes this method really slow
    for(i=0; i<l; i++){
        ship = this.expandedFleet[i];
        if(ship[0]){
            ship[1] = ship[2].s;
            cleanList.push(ship);
        } else {
            ship = null;
        }
    }
    this.expandedFleet = cleanList;
};


group.prototype.attack = function(contrary, stats){
    var m = contrary.expandedFleet.length, /* Amount of enemy ships */
        ft = null, /* UnitType of the current ship */
        Dm = 0.0, /* Attack points of the current ship */
        Dc = 0.0, /* Attack points required to bypass the Large Shield Dome defenses */
        f = null, /* Current Ship */
        uk = 0, /* Random defensive ship Index */
        u = null, /* Random defensive ship */
        ut = null, /* UnitType of the defensive ship */
        De = 0.0, /* Damage done after destroying the shields */
        xp = 0.0, /* probability of an explosion */
        c, /* Amount of ships in the ally group */
        i = -1, /* Ally loop index */
        rn = true; /* Let the current ship attack again, or not? */

    //we save the base amount of shoots, and the amount of ships in the ally fleet group.
    c = stats.sh = this.expandedFleet.length;
    while( ++i < c ){
    //for(var i=0; i<c; i++){
        f = this.expandedFleet[i];
        ft = f[2];
        Dm = ft.d;
        Dc = Dm * 100.0;
        rn = true;

        //Current Ship loop
        do{
            stats.ap = stats.ap + Dm; //We shoot! and we update the statistics accordingly

            //We pick a random target in the opposite fleet group
            uk = Math.random() * m|0;
            u = contrary.expandedFleet[uk];
            ut = u[2]; //we save the unit type of the target

            // Is this ship still operational? Well, let's check if it resists the shot
            if(u[0]){

                //Shield wasn't strong enough to ignore the shot (Large Shield Domes check)
                if( Dc > u[2].s ){

                    //Shield wasn't strong enough to survive the shot
                    if(Dm > u[1] ){
                        De = Dm - u[1]; // New damage, after substracting the shield points of the current target
                        stats.sp = stats.sp + u[1]; // We update the shield damage statistics
                        //target's shield is now zero
                        u[1] = 0;

                        if( De < u[0] ){ //Check if the ships "health" is higher than the damage

                            u[0] = u[0] - De; //We substract health points from the target

                            // Probability of an explosion
                            xp = ( ut.h - u[0] ) / ut.h;
                            if(  ( xp > 0.3 ) && Math.random() < xp ) {
                                u[0] = 0; // Kaboom
                                ut.x = ut.x + 1; // <- Increasing the number of explosions in the unittype statistics
                            }

                        } else {
                            u[0] = 0; // Kaboom. The target did not survive that shot
                            ut.x = ut.x + 1; // <- Increasing the number of explosions in the statistics
                        }
                    } else {
                        u[1] = u[1] - Dm; // The shield survived the shot. We decrease the shield points of the target
                        stats.sp = stats.sp + Dm; // We update the shield damage statistics
                    }

                    //This step is not needed, u is an object, and is passed by reference
                    //contrary.expandedFleet[uk] = u;


                // Unsuccesful shot
                } else {
                    stats.sp = stats.sp + Dm; // We update the shield damage statistics
                    rn = false; //We leave the single ship loop, because there are no ships with rapidfire against Large Shield Domes
                    //(and the attack completely failed)
                }
            }

            //Rapid fire calculations. Do we have rapidfire rules available? (for both attacking ship and target)
            if( ft.rf[ut.i] ){
                //Do we get another turn?
                if ( Math.random() < ft.rf[ut.i] ){
                    stats.sh = stats.sh + 1; //Yes we did. We update the total amount of shots
                    // We stay in the ship loop
                    //rn = true; <= implicit
                } else {
                    rn = false; // We leave the ship loop
                }
            } else {
                rn = false; // We leave the ship loop
            }

        } while(rn);
        
    }
    //End of the fleet group loop

};

group.prototype.getReports = function(){
    //TODO
};

module.exports = group;
},{"./fleet":8,"./tools":14}],11:[function(require,module,exports){
//resource information, based on the pricelist array
var resource = function(pricelist, rapidfireConf){

    this.id = pricelist.id;
    this.name = pricelist.name;

    this.rapidFire = {};

    if(this.id=="1" || this.id=="2" || this.id=="3" ){
        this.initializeLocation(pricelist);
    } else if( resource.getDefenseTypes().indexOf(this.id) > -1 ){
        this.initializeDefense(pricelist);
    } else if( resource.getShipTypes().indexOf(this.id) > -1 ){
        this.initializeShip(pricelist);
        this.initializeRapidfire(rapidfireConf);
    }
};
//Defenses
resource.prototype.initializeDefense = function(pricelist){
    this.metal = pricelist.metal;
    this.crystal = pricelist.crystal;
    this.deuterium = pricelist.deuterium;
    this.attack = pricelist.attack;
    this.defense = pricelist.defense;
    this.hull = pricelist.hull;
    this.capacity = 0;
};
//Ships
resource.prototype.initializeShip = function(pricelist){
    this.metal = pricelist.metal;
    this.crystal = pricelist.crystal;
    this.deuterium = pricelist.deuterium;
    this.attack = pricelist.attack;
    this.defense = pricelist.defense;
    this.hull = pricelist.hull;
    this.capacity = pricelist.capacity;
};
//planets
resource.prototype.initializeLocation = function(pricelist){
    this.metal = pricelist.metal;
    this.crystal = pricelist.crystal;
    this.deuterium = pricelist.deuterium;
};
//Ships' rapidfire against other unit types
resource.prototype.initializeRapidfire = function(rapidfireConf){
    var rapidFireRules, r;

    if(rapidfireConf[this.id]){
        rapidFireRules = rapidfireConf[this.id];
        for( var n in rapidFireRules){
            if(!rapidFireRules.hasOwnProperty(n)){ continue; }
            r = rapidFireRules[n];

            this.rapidFire[n] = (1 - ( 1 / r ));
        }
    }
};

resource.getDefenseTypes = function() {
    return ["401","402","403","404","405","406","407","408"];
};

resource.getShipTypes = function(){
    return ["202","203","204","205","206","207","208","209","210","211","212","213","214","215"];
};

//Type of a Location
resource.PLANET = "1";
resource.MOON = "2";
resource.DEBRIS = "3";

module.exports = resource;
},{}],12:[function(require,module,exports){
//statistics of a battle round
var Attackstatistics = require('./attackstatistics');

var roundstatistics = function(attackGroup, defenseGroup){

    this.results = [];
    this.attackGroup = attackGroup;
    this.defenseGroup = defenseGroup;
};

roundstatistics.prototype.init = function(attstats, dfstats){
    this.attstats = attstats;
    this.dfstats = dfstats;
    this.update( 0 );
};

roundstatistics.prototype.update = function( round ){
    var ft,
        attCompressed = [],
        dfCompressed = [],
        i,
        stats;

    for(i=0; i < this.attackGroup.fleets.length; i++ ){
        ft = this.attackGroup.fleets[i];
        stats = ft.getStats();
        //console.log(stats);
        attCompressed.push( stats );
    }

    for(i=0; i < this.defenseGroup.fleets.length; i++ ){
        ft = this.defenseGroup.fleets[i];
        stats = ft.getStats();
        //console.log(stats);
        dfCompressed.push( stats );
    }

    this.results.push({
        "attack_fleet" : {
            "current": attCompressed,
            "attack_points": this.attstats.ap,
            "shield_defense": this.attstats.sp,
            "number_of_shoots" : this.attstats.sh
        },
        "defense_fleet" : {
            "current": dfCompressed,
            "attack_points": this.dfstats.ap,
            "shield_defense": this.dfstats.sp,
            "number_of_shoots" : this.dfstats.sh
        },
        "round" : round
    } ) ;

};

module.exports = roundstatistics;
},{"./attackstatistics":5}],13:[function(require,module,exports){
(function (process){
var prettyHrtime = require('pretty-hrtime'); //leave this line alone
process.hrtime = require('browser-process-hrtime'); //Uncomment this line when using browserify

var timer = function(){
    this.records = {};
};

timer.prototype.start = function(id){
    this.records[id] = {
        start : process.hrtime(),
        end: null
    };
};

timer.prototype.end = function(id){

    if(!this.records[id]){
        console.log( "Timer "+id+" not available!!");
        return;
    }

    this.records[id].end = process.hrtime(this.records[id].start);
};

timer.prototype.buildResults = function(){

    var precision = 6,
        elapsed;

    for( var id in this.records ){
        if(!this.records.hasOwnProperty(id)){ continue; }

        if(!this.records[id].end){
            console.log( "Timer "+id+" not closed!!");
            continue;
        }

        this.records[id].description = prettyHrtime(this.records[id].end, {precise:true});
        delete this.records[id].start;
        delete this.records[id].end;
    }

};

module.exports = timer;
}).call(this,require('_process'))
},{"_process":1,"browser-process-hrtime":2,"pretty-hrtime":3}],14:[function(require,module,exports){
/* Misc tools */
var tools = function(){
};

/* Class functions */
tools.fillArray = function(val, num){

  var data = [], i=0;
  //while(i<num) {
  for(var i=0; i<num; i++){
    data.push(val.slice(0));
    //i++;
  }
  return data;

  /* Slower
  var data = new Array(num);
  var i=0;
  while (i<num) {
      data[i] = val.slice(0);
      i++;
  }
  return data;
  */
};

//TODO: please use me
tools.calcAverage = function(datalist){
  if(!datalist.length){ return 0; }
  if(datalist.length==1){ return datalist[0]; }

  var sum = 0;
  for(var i=0; i<datalist.length; i++ ){
    sum += datalist[i];
  }
  return sum / datalist.length;
};

//TODO: please use me
tools.calcStandardDeviation = function(datalist){
  if(!datalist.length){ return [0, 0]; }
  if(datalist.length==1){ return [0, datalist[0]]; } //avoid infinites

  var sum = 0, avg = tools.calcAverage(datalist), sdp;
  for(var i=0; i<datalist.length; i++ ){
    sum += (datalist[i] - avg) * (datalist[i] - avg);
  }
  sdp = (1 / (datalist.length - 1 ) ) * sum;
  return [Math.sqrt(sdp), avg];
};

tools.appendToArray = function(data, val, num){
    for(var i=0; i<num; i++){
        data.push(val.slice(0));
    }
};

tools.bytesToSize = function(bytes) {
   if(bytes === 0) return '0 Byte';
   var k = 1000;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
};

module.exports = tools;
},{}]},{},[4]);

var isObject = function(a) {
    return (!!a) && (a.constructor === Object);
};

function stringifyObject(o, nest) {
  var out = '', nest = '';
  for (var p in o) {
    if(!isObject(o[p])){
        out += nest + p + ': ' + o[p] + '\n';
    } else {
        out += nest + p + ': ' + stringifyObject(o[p], nest+'\t') + '\n';
    }
    
  }
  return out;
}


var attackerList = [
    {
        "fleet": {"204": 1500000},
        "player_id" : "1",
        "military_tech" : 10,
        "defense_tech" : 10,
        "hull_tech" : 10
    }
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

var PlayerList = {
    "1" : "Player 1",
    "2" : "Player 2"
};

var numSimulations = 1; //Does not work, yet!

var battle = new global.OgsimBattle(attackerList, defenderList, numSimulations, function(stats, rounds){
    print(stringifyObject(stats));
    print(stringifyObject(rounds));
});