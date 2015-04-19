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