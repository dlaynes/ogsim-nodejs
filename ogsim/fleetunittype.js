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